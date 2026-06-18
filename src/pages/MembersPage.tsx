import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    ArcElement, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
    Users, Award, TrendingUp, Calendar, 
    ArrowUpRight, ArrowDownRight, Search, Download 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type MemberRow = {
    id: number;
    year: number;
    professional_members: number;
    student_members: number;
    total_members: number;
};

type SortField = "year" | "professional_members" | "student_members" | "total_members";

const pct = (a: number, b?: number) =>
    b ? Math.round(((a - b) / b) * 100) : null;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } as any
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } as any
  },
};

const StatCard = ({
    label, value, delta, refYear, icon: Icon
}: { label: string; value: number | string; delta?: number | null; refYear?: number, icon: any }) => (
    <motion.div 
        variants={fadeUp}
        whileHover={{ y: -4 }}
        className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
    >
        {/* Hover decorative background glow */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Icon size={20} className="text-blue-600" />
            </div>
        </div>

        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100/80 relative z-10">
            {delta !== null && delta !== undefined ? (
                <>
                    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${delta >= 0 ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                        {delta >= 0 ? <ArrowUpRight size={12} className="shrink-0" /> : <ArrowDownRight size={12} className="shrink-0" />}
                        {Math.abs(delta)}%
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">vs {refYear}</span>
                </>
            ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    2020 – 2024
                </span>
            )}
        </div>
    </motion.div>
);

const TrendBars = ({ data, currentId }: { data: MemberRow[]; currentId: number }) => {
    const idx = data.findIndex((r) => r.id === currentId);
    const slice = data.slice(Math.max(0, idx - 3), idx + 1).reverse();
    const max = Math.max(...slice.map((r) => r.total_members), 1);
    return (
        <div className="flex items-end gap-1">
            <style>{slice.map((r) => `.tb-${currentId}-${r.id} { height: ${Math.round((r.total_members / max) * 20)}px; }`).join(' ')}</style>
            {slice.map((r) => (
                <div
                    key={r.id}
                    title={`${r.year}: ${r.total_members} members`}
                    className={`w-2 rounded-sm bg-gradient-to-t from-blue-600 to-sky-400 tb-${currentId}-${r.id} transition-all duration-300 hover:from-blue-700 hover:to-sky-500`}
                />
            ))}
        </div>
    );
};

const RankBadge = ({ rank }: { rank: number }) => {
    const styles: Record<number, string> = {
        0: "bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm",
        1: "bg-slate-100 text-slate-700 border border-slate-200 shadow-sm",
        2: "bg-orange-50 text-orange-700 border border-orange-200/60 shadow-sm",
    };
    return (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${styles[rank] ?? "bg-slate-50 text-slate-600 border border-slate-200"}`}>
            {rank + 1}
        </div>
    );
};

const MembersPage = () => {
    const [rows, setRows] = useState<MemberRow[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>("year");
    const [sortAsc, setSortAsc] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("member_counts").select("*").order("year", { ascending: false });
            if (error) { setErrorMsg(error.message); setRows([]); }
            else setRows(data || []);
            setLoading(false);
        })();
    }, []);

    const years = useMemo(() => [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a), [rows]);

    const latest = rows[0];
    const prev = rows[1];
    const maxTotal = Math.max(...rows.map((r) => r.total_members), 1);

    const filtered = useMemo(() => {
        let r = rows;
        if (selectedYear !== "all") r = r.filter((x) => x.year === Number(selectedYear));
        if (search) r = r.filter((x) => String(x.year).includes(search));
        return [...r].sort((a, b) => sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField]);
    }, [rows, selectedYear, search, sortField, sortAsc]);

    const handleSort = (field: SortField) => {
        if (sortField === field) setSortAsc((p) => !p);
        else { setSortField(field); setSortAsc(false); }
    };

    const exportCSV = () => {
        const csv = "Year,Professional Members,Student Members,Total Members\n"
            + filtered.map((r) => `${r.year},${r.professional_members},${r.student_members},${r.total_members}`).join("\n");
        const a = document.createElement("a");
        a.href = "data:text/csv," + encodeURIComponent(csv);
        a.download = "ieee_members.csv"; a.click();
    };

    const sortedByTotal = useMemo(() => [...filtered].sort((a, b) => b.total_members - a.total_members), [filtered]);

    const barData = {
        labels: [...rows].reverse().map((r) => r.year),
        datasets: [
            { label: "Professional", data: [...rows].reverse().map((r) => r.professional_members), backgroundColor: "#185FA5", borderRadius: 4 },
            { label: "Student", data: [...rows].reverse().map((r) => r.student_members), backgroundColor: "#1D9E75", borderRadius: 4 },
        ],
    };

    const donutData = latest ? {
        labels: ["Professional", "Student"],
        datasets: [{ data: [latest.professional_members, latest.student_members], backgroundColor: ["#185FA5", "#1D9E75"], borderWidth: 0 }],
    } : null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
            {/* Background ambient glowing spheres */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
            <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[130px] pointer-events-none" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

            <Navbar />

            {/* CREATIVE HERO */}
            <section className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden bg-gradient-to-b from-blue-50 via-slate-50 to-white border-b border-slate-200/60">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />
                
                {/* Soft floating accents */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 right-24 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"
                />

                <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 backdrop-blur text-xs font-semibold text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.05)] mb-4"
                    >
                        <Users size={14} className="text-blue-600 animate-pulse" />
                        Membership Analytics
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-3 text-slate-900"
                    >
                        Membership<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 drop-shadow-[0_4px_15px_rgba(37,99,235,0.08)]"> Dashboard</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed font-light mb-8"
                    >
                        IEEE Professional &amp; Student member analytics — Sri Ramakrishna Engineering College
                    </motion.p>

                    {/* Year Quick Filter Chips */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap gap-2 justify-center max-w-2xl"
                    >
                        {["all", ...years].map((y) => (
                            <button
                                key={y}
                                onClick={() => setSelectedYear(String(y))}
                                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border ${
                                    selectedYear === String(y)
                                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                                        : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-950 shadow-sm"
                                }`}
                            >
                                {y === "all" ? "All Years" : `${y}`}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 md:px-8 pb-16 relative z-10 flex-grow w-full -mt-8">
                {loading && (
                    <div className="py-24 flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin shadow-md" />
                        <p className="mt-4 text-slate-500 text-sm font-medium tracking-wide">Loading Membership Analytics...</p>
                    </div>
                )}
                {!loading && errorMsg && (
                    <div className="bg-white rounded-2xl border border-red-200 border-dashed py-12 text-center px-4 shadow-md max-w-md mx-auto">
                        <p className="text-rose-600 text-sm font-semibold">Error: {errorMsg}</p>
                    </div>
                )}

                {!loading && !errorMsg && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-8"
                    >
                        {/* STATS CARDS GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard 
                                label="Total members (latest)" 
                                value={latest?.total_members ?? "—"} 
                                delta={pct(latest?.total_members, prev?.total_members)} 
                                refYear={prev?.year}
                                icon={Users}
                            />
                            <StatCard 
                                label="Professional members" 
                                value={latest?.professional_members ?? "—"} 
                                delta={pct(latest?.professional_members, prev?.professional_members)} 
                                refYear={prev?.year}
                                icon={Award}
                            />
                            <StatCard 
                                label="Student members" 
                                value={latest?.student_members ?? "—"} 
                                delta={pct(latest?.student_members, prev?.student_members)} 
                                refYear={prev?.year}
                                icon={TrendingUp}
                            />
                            <StatCard 
                                label="Years tracked" 
                                value={rows.length} 
                                icon={Calendar}
                            />
                        </div>

                        {/* CHARTS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            {/* Bar Chart */}
                            <motion.div 
                                variants={fadeUp}
                                className="md:col-span-3 bg-white/85 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">Membership growth</h3>
                                    <p className="text-[11px] font-semibold text-slate-500 mb-6">Professional vs student members by year</p>
                                </div>
                                <div className="h-64 flex items-center justify-center">
                                    <Bar 
                                        data={barData} 
                                        options={{ 
                                            responsive: true, 
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } }, 
                                            scales: { 
                                                x: { grid: { display: false } },
                                                y: { ticks: { precision: 0 } }
                                            } 
                                        }} 
                                    />
                                </div>
                                <div className="flex gap-6 mt-4 border-t border-slate-105 pt-4">
                                    <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <span className="w-3.5 h-3.5 rounded-md inline-block bg-[#185FA5]" />Professional
                                    </span>
                                    <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <span className="w-3.5 h-3.5 rounded-md inline-block bg-[#1D9E75]" />Student
                                    </span>
                                </div>
                            </motion.div>

                            {/* Doughnut Chart */}
                            <motion.div 
                                variants={fadeUp}
                                className="md:col-span-2 bg-white/85 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">Member split (latest year)</h3>
                                    <p className="text-[11px] font-semibold text-slate-500 mb-6">Professional vs student ratio</p>
                                </div>
                                <div className="h-56 flex items-center justify-center relative">
                                    {donutData && <Doughnut data={donutData} options={{ cutout: "72%", plugins: { legend: { display: false } }, maintainAspectRatio: false }} />}
                                    {latest && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest leading-none">Total</p>
                                            <p className="text-3xl font-black text-slate-900 leading-none mt-1">{latest.total_members}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 mt-4 border-t border-slate-105 pt-4">
                                    {donutData?.labels?.map((l, i) => (
                                        <span key={String(l)} className="flex items-center justify-between text-xs font-bold text-slate-600">
                                            <span className="flex items-center gap-2">
                                                <span className={`w-3.5 h-3.5 rounded-md inline-block ${i === 0 ? "bg-[#185FA5]" : "bg-[#1D9E75]"}`} />
                                                {String(l)}
                                            </span>
                                            <span className="text-slate-900">
                                                {donutData.datasets[0].data[i]} ({Math.round((donutData.datasets[0].data[i] / (latest?.total_members || 1)) * 105)}%)
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* DATA TABLE SECTION */}
                        <motion.div 
                            variants={fadeUp}
                            className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden"
                        >
                            {/* CONTROL BAR */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-slate-100">
                                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:flex-initial">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            value={search} 
                                            onChange={(e) => setSearch(e.target.value)} 
                                            placeholder="Search year…" 
                                            className="w-full sm:w-44 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-xs text-slate-800 placeholder-slate-400 transition-all" 
                                        />
                                    </div>
                                    <div className="relative">
                                        <select 
                                            aria-label="Filter by year" 
                                            value={selectedYear} 
                                            onChange={(e) => setSelectedYear(e.target.value)} 
                                            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-xs text-slate-800 transition-all cursor-pointer font-bold"
                                        >
                                            <option value="all">All Years</option>
                                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={exportCSV} 
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-black bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/10 active:scale-95"
                                >
                                    <Download size={14} />
                                    Export CSV
                                </button>
                            </div>

                            {/* TABLE */}
                            {filtered.length === 0 ? (
                                <div className="py-16 text-center px-4">
                                    <Users size={32} className="mx-auto text-slate-400 mb-2" />
                                    <p className="text-slate-500 text-xs font-semibold">No data found for the selected query.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <style>
                                        {filtered.map(r => {
                                            const p = Math.round((r.professional_members / r.total_members) * 100);
                                            const t = Math.round((r.total_members / maxTotal) * 100);
                                            return `.bar-p-${r.id}{width:${p}%} .bar-s-${r.id}{width:${100-p}%} .bar-t-${r.id}{width:${t}%}`;
                                        }).join(' ')}
                                    </style>
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-[#002855] text-white/95 text-xs font-bold border-b border-slate-200">
                                                <th className="px-6 py-4 text-left w-16">#</th>
                                                {(["year", "professional_members", "student_members", "total_members"] as SortField[]).map((f) => (
                                                    <th 
                                                        key={f} 
                                                        className="px-6 py-4 text-left cursor-pointer hover:bg-[#001f42] transition-colors select-none" 
                                                        onClick={() => handleSort(f)}
                                                    >
                                                        <div className="flex items-center gap-1.5 font-bold">
                                                            {f === "year" ? "Year" : f === "professional_members" ? "Professional" : f === "student_members" ? "Student" : "Total"}
                                                            <span className="text-[10px] text-white/60">
                                                                {sortField === f ? (sortAsc ? "▲" : "▼") : "⇅"}
                                                            </span>
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="px-6 py-4 text-left font-bold">Share (Prof / Stud)</th>
                                                <th className="px-6 py-4 text-left font-bold">Total Share</th>
                                                <th className="px-6 py-4 text-left font-bold">Trend (Last 4 Years)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filtered.map((row) => {
                                                const rank = sortedByTotal.findIndex((x) => x.id === row.id);
                                                const profPct = Math.round((row.professional_members / row.total_members) * 100);
                                                return (
                                                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                                                        <td className="px-6 py-4"><RankBadge rank={rank} /></td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 shadow-sm">
                                                                {row.year}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-black text-slate-800 w-8">{row.professional_members}</span>
                                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                                    <div className={`h-full bg-blue-750 rounded-full bar-p-${row.id} transition-all duration-500`} />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400">{profPct}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-black text-slate-800 w-8">{row.student_members}</span>
                                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                                    <div className={`h-full bg-teal-600 rounded-full bar-s-${row.id} transition-all duration-500`} />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400">{100 - profPct}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-black text-sm text-blue-750">{row.total_members}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                                    <div className={`h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full bar-t-${row.id} transition-all duration-500`} />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400">{Math.round((row.total_members / maxTotal) * 100)}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4"><TrendBars data={rows} currentId={row.id} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default MembersPage;