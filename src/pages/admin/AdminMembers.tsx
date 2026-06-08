import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MemberRow = {
  id: number;
  year: number;
  professional_members: number;
  student_members: number;
  total_members: number;
};

export default function AdminMembers() {
  const [memberRows, setMemberRows] = useState<MemberRow[]>([]);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

  const [memberForm, setMemberForm] = useState({
    year: "2025",
    professional_members: "",
    student_members: "",
    total_members: "",
  });

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("member_counts")
      .select("*")
      .order("year", { ascending: false });

    setMemberRows(data || []);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMemberForm({
      year: "2025",
      professional_members: "",
      student_members: "",
      total_members: "",
    });
  };

  const submitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      year: Number(memberForm.year),
      professional_members: Number(memberForm.professional_members),
      student_members: Number(memberForm.student_members),
      total_members: Number(memberForm.total_members),
    };
    if (editingMemberId) {
      const { error } = await supabase.from("member_counts").update(payload).eq("id", editingMemberId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("member_counts").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetMemberForm();
    fetchMembers();
  };

  const deleteMember = async (id: number) => {
    const ok = window.confirm("Delete this member count?");
    if (!ok) return;
    const { error } = await supabase.from("member_counts").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchMembers();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submitMember} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
          {editingMemberId ? "Edit Member Count" : "Add Member Count"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="number"
            placeholder="Year"
            value={memberForm.year}
            onChange={(e) => setMemberForm({ ...memberForm, year: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="number"
            placeholder="Professional Members"
            value={memberForm.professional_members}
            onChange={(e) => setMemberForm({ ...memberForm, professional_members: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="number"
            placeholder="Student Members"
            value={memberForm.student_members}
            onChange={(e) => setMemberForm({ ...memberForm, student_members: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="number"
            placeholder="Total Members"
            value={memberForm.total_members}
            onChange={(e) => setMemberForm({ ...memberForm, total_members: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
        </div>

        <div className="mt-6 flex gap-4">
          <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white hover:bg-opacity-90 transition">
            {editingMemberId ? "Update" : "Add"}
          </button>
          {editingMemberId && (
            <button
              type="button"
              onClick={resetMemberForm}
              className="rounded-lg bg-slate-200 px-6 py-3 font-semibold hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Professional</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberRows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-slate-50">
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.year}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.professional_members}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.student_members}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.total_members}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingMemberId(row.id);
                        setMemberForm({
                          year: String(row.year),
                          professional_members: String(row.professional_members),
                          student_members: String(row.student_members),
                          total_members: String(row.total_members),
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMember(row.id)}
                      className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
