import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Crown, GraduationCap, Users, ArrowRight, Network, Award, Globe, Zap } from "lucide-react";

const TeamPage = () => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } as any },
    };

    const teamCategories = [
        {
            title: "Faculty & Advisers",
            description: "Eminent professors and industry mentors who shape the vision and ensure the academic rigor of our student branch.",
            icon: GraduationCap,
            href: "/senior-members",
            accentColor: "text-blue-600",
            bgLight: "bg-blue-50",
            border: "group-hover:border-blue-200",
            shadow: "group-hover:shadow-blue-900/5",
        },
        {
            title: "Office Bearers",
            description: "The core executive committee of student leaders driving the planning, operations, and execution of all global initiatives.",
            icon: Crown,
            href: "/office-bearers",
            accentColor: "text-emerald-600",
            bgLight: "bg-emerald-50",
            border: "group-hover:border-emerald-200",
            shadow: "group-hover:shadow-emerald-900/5",
        },
        {
            title: "Student Members",
            description: "Our diverse community of passionate engineering students building solutions and contributing to collaborative projects.",
            icon: Users,
            href: "/members",
            accentColor: "text-cyan-600",
            bgLight: "bg-cyan-50",
            border: "group-hover:border-cyan-200",
            shadow: "group-hover:shadow-cyan-900/5",
        },
    ];

    const stats = [
        { icon: Award, label: "Awards Won", value: "45+" },
        { icon: Globe, label: "Global Projects", value: "120+" },
        { icon: Users, label: "Active Members", value: "500+" },
        { icon: Zap, label: "Events Hosted", value: "10K+" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-300 selection:text-slate-900 flex flex-col">
            <Navbar />

            {/* Advanced Professional Deep-Blue Hero Section */}
            <section className="relative pt-36 pb-32 md:pt-48 md:pb-40 overflow-hidden bg-gradient-to-br from-[#001730] via-[#003764] to-[#005a8d] border-b border-slate-800">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
                
                <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[400px] -right-[200px] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" 
                />
                <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-500/20 blur-[120px] pointer-events-none transform -translate-x-1/4" 
                />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } as any },
                    }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div variants={itemVariants} className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-blue-50 font-semibold text-xs tracking-[0.2em] uppercase shadow-lg">
                        <Network size={16} className="text-cyan-300" />
                        <span>The People of IEEE SREC</span>
                    </div>
                    </motion.div>

                    <motion.h1 
                    variants={itemVariants}
                    className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8"
                    >
                    Leadership & <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-white drop-shadow-sm">
                        Excellence
                    </span>
                    </motion.h1>

                    <motion.p 
                    variants={itemVariants}
                    className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                    A dynamic collective of visionaries, mentors, and innovators dedicated to bridging the gap between academic theory and real-world technological advancement.
                    </motion.p>
                </motion.div>
                </div>
                
                {/* Soft overhang overlay line */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            </section>

            {/* Structured Navigation Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 flex-grow relative z-20 -mt-12 md:-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                    {teamCategories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                            >
                                <Link
                                    to={category.href}
                                    className={`group flex flex-col h-full bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-xl ${category.shadow} hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 overflow-hidden relative`}
                                >
                                    {/* Subtle Top Gradient Line */}
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.bgLight.replace('bg-', 'from-').replace('50', '200')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${category.bgLight} border border-white/50 shadow-sm transition-transform duration-500 group-hover:scale-110`}>
                                        <Icon size={32} className={`${category.accentColor}`} />
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-[#00629b] transition-colors">
                                        {category.title}
                                    </h2>

                                    <p className="text-slate-600 leading-relaxed min-h-[5rem] mb-10">
                                        {category.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                                        <span className="font-semibold text-slate-500 text-sm tracking-wide group-hover:text-slate-900 transition-colors uppercase">
                                            View Directory
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#003764] group-hover:text-white transition-all duration-300 shadow-sm">
                                            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                    
                                    {/* Floating decorative background shape */}
                                    <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${category.bgLight} blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none`} />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            {/* Animated Impact Stats Section */}
            <section className="py-20 bg-white border-y border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-50 rounded-full blur-[80px] pointer-events-none translate-y-1/2" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold text-slate-900 tracking-tight"
                        >
                            The Strength in Numbers
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 mt-4 max-w-xl mx-auto font-medium"
                        >
                            Our collective achievements are driven by the dedication of every individual in our network.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, i) => {
                            const SIcon = stat.icon;
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5, type: "spring" }}
                                    className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 text-center shadow-sm hover:shadow-md group"
                                >
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-200 text-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                                        <SIcon size={24} />
                                    </div>
                                    <h4 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 tracking-tighter">
                                        {stat.value}
                                    </h4>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Minimalist Closing Section */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="p-8 md:p-12 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50"
                    >
                        <Network size={40} className="text-slate-300 mx-auto mb-6" />
                        <h3 className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed mb-6">
                            "A collective force shaping the future of engineering."
                        </h3>
                        <p className="text-sm font-bold tracking-widest text-[#00629b] uppercase">IEEE SREC Core Value</p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TeamPage;