import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Trophy,
    Award as AwardIcon,
    Medal,
    Sparkles,
    Search,
    Loader2,
    Star,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

type Award = {
    id: number;
    title: string;
    year: number;
    description: string | null;
    category: string | null;
    amount: string | null;
    image_url?: string | null;
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.08 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: "easeOut" }
    }
};

const heroVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" }
    }
};

const getValidImageUrl = (url?: string | null) => {
    if (!url || !url.trim()) return "";
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
    const { data } = supabase.storage.from("activities").getPublicUrl(safePath);
    return data?.publicUrl || "";
};

const AwardsPage = () => {
    const [data, setData] = useState<Award[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("All");

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from("awards")
                .select("*")
                .order("year", { ascending: false });

            setData(data || []);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const availableYears = useMemo(() => {
        return ["All", ...Array.from(new Set(data.map((d) => d.year.toString())))].sort(
            (a, b) => (b === "All" ? 1 : a === "All" ? -1 : Number(b) - Number(a))
        );
    }, [data]);

    const filteredAwards = useMemo(() => {
        return data.filter((award) => {
            const matchesYear = selectedYear === "All" || award.year?.toString() === selectedYear;
            const term = search.toLowerCase();

            const matchesSearch =
                !term ||
                (award.title && award.title.toLowerCase().includes(term)) ||
                (award.description && award.description.toLowerCase().includes(term)) ||
                (award.category && award.category.toLowerCase().includes(term));

            return matchesYear && matchesSearch;
        });
    }, [data, search, selectedYear]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
            <Navbar />

            <section className="bg-[#003764] text-white pt-28 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />

                <motion.div
                    animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                    className="absolute top-20 right-16 opacity-20 hidden md:block"
                >
                    <Trophy size={120} />
                </motion.div>

                <motion.div
                    animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut" }}
                    className="absolute bottom-12 left-10 opacity-10 hidden md:block"
                >
                    <Medal size={90} />
                </motion.div>

                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute top-1/3 left-[8%] h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl"
                />

                <motion.div
                    animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                    className="absolute bottom-12 right-[10%] h-52 w-52 rounded-full bg-amber-300/10 blur-3xl"
                />

                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto px-4 md:px-8 relative z-10"
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.45, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg"
                        >
                            <Sparkles size={14} />
                            Hall of Fame
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 text-center"
                        >
                            Honors & Awards
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="text-lg text-blue-100 max-w-2xl mx-auto text-center"
                        >
                            Celebrating the outstanding achievements, grants, and recognitions earned by the visionary students and professors of IEEE SREC.
                        </motion.p>
                    </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent translate-y-1" />
            </section>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 -mt-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 flex flex-col xl:flex-row gap-5 xl:items-center justify-between"
                >
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by award title, description, or category..."
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#00629b]/20 focus:border-[#00629b] transition text-sm font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2">Year</span>
                        {availableYears.map((y) => (
                            <motion.button
                                key={y}
                                whileHover={{ y: -2, scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setSelectedYear(y)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                                    selectedYear === y
                                        ? "bg-[#00629b] text-white shadow-md shadow-[#00629b]/20"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {y}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-[#00629b]/50 mb-4" />
                        <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading Awards...</p>
                    </div>
                ) : filteredAwards.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300"
                    >
                        <Trophy className="mx-auto text-slate-300 w-16 h-16 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Awards Found</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            We couldn't find any awards matching your current filters. Try adjusting your search criteria.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-6"
                    >
                        <AnimatePresence>
                            {filteredAwards.map((award, index) => (
                                <motion.div
                                    key={award.id}
                                    variants={itemVariants}
                                    layout
                                    whileHover={{
                                        y: -10,
                                        rotateX: 1,
                                        rotateY: index % 2 === 0 ? 1.5 : -1.5,
                                    }}
                                    transition={{ duration: 0.28 }}
                                    className="bg-white border text-left border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-2xl hover:border-amber-200 transition-all duration-300 group flex flex-col sm:flex-row gap-6 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.5)_45%,transparent_70%)] translate-x-[-120%] group-hover:translate-x-[120%]" />

                                    <motion.div
                                        animate={{ scaleY: [1, 1.04, 1] }}
                                        transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
                                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-[#00629b]"
                                    />

                                    <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-4">
                                        <motion.div
                                            whileHover={{ rotate: 10, scale: 1.08 }}
                                            transition={{ duration: 0.25 }}
                                            className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-300 shadow-sm"
                                        >
                                            {award.category?.toLowerCase().includes("grant") ? (
                                                <Star size={32} />
                                            ) : award.category?.toLowerCase().includes("winner") ? (
                                                <Trophy size={32} />
                                            ) : (
                                                <AwardIcon size={32} />
                                            )}
                                        </motion.div>

                                        <motion.div
                                            animate={{ y: [0, -2, 0] }}
                                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                            className="flex flex-col"
                                        >
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">
                                                Year
                                            </span>
                                            <span className="text-xl font-black text-[#003764]">
                                                {award.year}
                                            </span>
                                        </motion.div>
                                    </div>

                                    <div className="flex-1 flex flex-col h-full">
                                        {award.category && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 text-slate-600 font-semibold text-xs mb-4 w-fit border border-slate-200 shadow-sm backdrop-blur-sm"
                                            >
                                                {award.category}
                                            </motion.div>
                                        )}

                                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3 group-hover:text-[#00629b] transition-colors underline-offset-4 text-center sm:text-left">
                                            {award.title}
                                        </h3>

                                        {award.description && (
                                            <p className="text-slate-600 leading-relaxed min-h-[3rem] mb-6 line-clamp-3 text-center sm:text-left">
                                                {award.description}
                                            </p>
                                        )}

                                        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                            {award.amount && award.amount !== "-" ? (
                                                <motion.div
                                                    whileHover={{ scale: 1.04 }}
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 text-emerald-700 font-bold border border-emerald-200/50 shadow-sm"
                                                >
                                                    <span className="text-emerald-600/70 text-[10px] uppercase tracking-widest font-extrabold mr-1">
                                                        Awarded
                                                    </span>
                                                    <span>{award.amount}</span>
                                                </motion.div>
                                            ) : (
                                                <div />
                                            )}

                                            {award.image_url && (
                                                <motion.a
                                                    whileHover={{ y: -2, scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    href={getValidImageUrl(award.image_url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00629b] hover:bg-[#004e7c] text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-[#00629b]/20 hover:shadow-lg"
                                                >
                                                    <motion.span
                                                        animate={{ rotate: [0, 12, -8, 0] }}
                                                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                                        className="inline-flex"
                                                    >
                                                        <Sparkles size={16} className="text-amber-300" />
                                                    </motion.span>
                                                    View Details
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AwardsPage;
