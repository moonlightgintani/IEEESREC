import { Link } from "react-router-dom";
import ieeeLogo from "@/assets/ieee-logo.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import { Mail, MapPin, Phone, Globe, ChevronRight } from "lucide-react";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const linkGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Our Activities", href: "/activities" },
      { label: "Societies", href: "/societies" },
    ]
  },
  {
    title: "People",
    links: [
      { label: "Meet the Team", href: "/Team" },
      { label: "Office Bearers", href: "/office-bearers" },
      { label: "Advisory Board", href: "/senior-members" },
      { label: "Contact Us", href: "/contact" },
    ]
  }
];

const Footer = () => (
  <footer className="relative bg-[#001730] text-slate-300 overflow-hidden font-sans border-t-[6px] border-[#00629b]">
    {/* Subtle Background Glow */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00629b]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />

    <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-10">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
        
        {/* About Section */}
        <div className="lg:col-span-4">
          <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-[#00a6d6] rounded-full inline-block"></span>
            Our Mission
          </h3>
          <p className="text-slate-400 leading-relaxed mb-8 pr-4">
            Functioning since 2001 under the IEEE Madras Section, we empower students through technological innovation, collaborative leadership, and global professional networking.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/ieee_srec?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-pink-600 hover:text-white transition-all shadow-md">
              <FaInstagram size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-md">
              <FaLinkedin size={18} />
            </a>
            <a href="https://youtube.com/@ieeesrec6081?si=ZkggKQhViaBN_kA3" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all shadow-md">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-8">
          {linkGroups.map((group) => (
             <div key={group.title}>
               <h3 className="text-white text-lg font-bold mb-6">{group.title}</h3>
               <ul className="space-y-4">
                 {group.links.map((link) => (
                   <li key={link.label}>
                     <Link to={link.href} className="group flex items-center text-slate-400 hover:text-white transition-colors">
                       <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#00a6d6] mr-1" />
                       <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                     </Link>
                   </li>
                 ))}
               </ul>
             </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-4">
          <h3 className="text-white text-lg font-bold mb-6">Connect With Us</h3>
          <ul className="space-y-5">
            <li>
              <a href="mailto:ieeestudentbranch@srec.ac.in" className="flex items-start gap-4 text-slate-400 hover:text-[#00a6d6] transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-[#001730] border border-transparent group-hover:border-[#00a6d6]/30 transition-all">
                  <Mail size={18} />
                </div>
                <div className="pt-2 truncate">ieeestudentbranch@srec.ac.in</div>
              </a>
            </li>
            <li>
              <a href="tel:+919080296675" className="flex items-start gap-4 text-slate-400 hover:text-[#00a6d6] transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-[#001730] border border-transparent group-hover:border-[#00a6d6]/30 transition-all">
                  <Phone size={18} />
                </div>
                <div className="pt-2">+91 9080296675</div>
              </a>
            </li>
            <li className="flex items-start gap-4 text-slate-400 group">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-transparent transition-all">
                <MapPin size={18} />
              </div>
              <div className="pt-1.5 leading-relaxed">
                Vattamalaipalayam, N.G.G.O Colony P.O, <br />Coimbatore – 641022
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 tracking-wide uppercase">
        <p>
          © {new Date().getFullYear()} IEEE Student Branch SREC. All rights reserved.
        </p>
        <div className="flex gap-4 items-center">
          <span>School Code: 41347756</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 inline-block"></span>
          <span>Branch Code: 61491</span>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;