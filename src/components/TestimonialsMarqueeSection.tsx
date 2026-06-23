import { useEffect, useState, useCallback } from "react";
import { Star, Quote, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import useEmblaCarousel from "embla-carousel-react";

const FALLBACK_QUOTES = [
  "IEEE SREC has consistently demonstrated technical excellence and leadership, empowering students to innovate and solve real-world challenges.",
  "My journey with IEEE SREC transformed my professional career. The networking opportunities and hackathons are truly unmatched.",
  "The hands-on workshops on AI and IoT provided by the student branch gave me the practical edge I needed for my placement.",
  "Being part of the executive team at SREC helped me connect with incredible mentors and build my confidence.",
  "The funding and guidance provided for our final year IEEE project was phenomenal. Proud to be part of the IEEE SREC leadership.",
  "Serving as an Office Bearer gave me incredible leadership skills and hands-on exposure to organizing massive institutional events."
];

const getAvatarFallback = (id: string | number) => {
  return `https://randomuser.me/api/portraits/${Number(id) % 2 === 0 ? "women" : "men"}/${(Number(id) % 99) + 1}.jpg`;
};

const getValidImageUrl = (url?: string | null) => {
    if (!url) return null;
    const path = url.trim();
    if (path.startsWith("http://")) {
        return "https://" + path.slice(7);
    }
    if (path.startsWith("https://")) {
        return path;
    }
    if (path.startsWith("http")) {
        return path;
    }
    const safePath = encodeURIComponent(path);
    const { data } = supabase.storage.from("office_bearers").getPublicUrl(safePath);
    return data?.publicUrl;
};

const TestimonialCard = ({ item, idx }: { item: any; idx: number }) => {
    const defaultImg = getValidImageUrl(item.image_url) || getAvatarFallback(item.id);
    const [imgSrc, setImgSrc] = useState(defaultImg);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(getValidImageUrl(item.image_url) || getAvatarFallback(item.id));
        setHasError(false);
    }, [item]);

    return (
        <div 
            className="w-[350px] md:w-[450px] bg-white rounded-none p-8 shadow-sm hover:shadow-lg border border-slate-100 shrink-0 transition-all duration-700 ease-in-out relative mx-3"
        >
            <Quote className="absolute top-6 right-8 text-emerald-500/20 w-12 h-12 rotate-180" />
            
            <div className="flex items-center gap-4 mb-6">
                <img 
                    src={imgSrc} 
                    alt={item.name} 
                    className="w-14 h-14 rounded-full border-2 border-emerald-100 object-cover shrink-0" 
                    onError={() => {
                        if (!hasError) {
                            setHasError(true);
                            setImgSrc(getAvatarFallback(item.id));
                        }
                    }}
                />
                <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-lg truncate">{item.name}</h4>
                    <p className="text-emerald-600 text-sm font-semibold truncate">{item.role}</p>
                </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed italic relative z-10">
                "{FALLBACK_QUOTES[idx % FALLBACK_QUOTES.length]}"
            </p>
            
            <div className="flex gap-1 mt-6">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
            </div>
        </div>
    );
};

const TestimonialsMarqueeSection = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchCore = async () => {
        const { data } = await supabase
            .from("office_bearers")
            .select("id, name, role, image_url")
            .eq("year", 2025)
            .limit(6);
        
        if (data && data.length > 0) {
            setMembers(data);
        }
        setIsLoading(false);
    };
    
    fetchCore();
  }, []);

  const marqueeItems = members.length > 0 ? [...members, ...members] : [];

  if (isLoading) return null;

  if (members.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-3xl mx-auto mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-4 border border-emerald-100">
          <Star size={14} className="fill-emerald-600" />
          <span>Voices of SREC</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
          What Our Leadership <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Says</span>
        </h2>
      </div>

      <div className="relative w-full max-w-[1500px] mx-auto px-4 md:px-12 group">
        
        {/* Navigation Arrows */}
        <button 
          aria-label="Previous testimonial"
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-lg flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all text-slate-400 focus:outline-none -translate-x-2 md:translate-x-4 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          aria-label="Next testimonial"
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-lg flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all text-slate-400 focus:outline-none translate-x-2 md:-translate-x-4 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={24} />
        </button>

        {/* Embla Track */}
        <div className="overflow-hidden w-full pb-8 pt-4 -mt-4 cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex">
            {marqueeItems.map((item, idx) => (
               <div key={`test-${item.id}-${idx}`} className="flex-[0_0_auto]">
                 <TestimonialCard item={item} idx={idx} />
               </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default TestimonialsMarqueeSection;
