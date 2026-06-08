import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type SeniorMember = {
  id: number;
  name: string;
  s_no: number | null;
  current_role: string | null;
  college: string | null;
  linkedin_url: string | null;
  image_url: string | null;
};

export default function AdminSeniorMembers() {
  const [seniorMembers, setSeniorMembers] = useState<SeniorMember[]>([]);
  const [editingSeniorId, setEditingSeniorId] = useState<number | null>(null);

  const [seniorForm, setSeniorForm] = useState({
    name: "",
    s_no: "",
    current_role: "",
    college: "",
    linkedin_url: "",
    image_url: "",
  });

  const fetchSeniorMembers = async () => {
    const { data } = await supabase.from("senior_members").select("*").order("s_no", { ascending: true });
    setSeniorMembers(data || []);
  };

  useEffect(() => {
    fetchSeniorMembers();
  }, []);

  const resetSeniorForm = () => {
    setEditingSeniorId(null);
    setSeniorForm({ name: "", s_no: "", current_role: "", college: "", linkedin_url: "", image_url: "" });
  };

  const submitSenior = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: seniorForm.name,
      s_no: Number(seniorForm.s_no) || null,
      current_role: seniorForm.current_role || null,
      college: seniorForm.college || null,
      linkedin_url: seniorForm.linkedin_url || null,
      image_url: seniorForm.image_url || null,
    };
    if (editingSeniorId) {
      const { error } = await supabase.from("senior_members").update(payload).eq("id", editingSeniorId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("senior_members").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetSeniorForm();
    fetchSeniorMembers();
  };

  const deleteSenior = async (id: number) => {
    const ok = window.confirm("Delete this senior member?");
    if (!ok) return;
    const { error } = await supabase.from("senior_members").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchSeniorMembers();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submitSenior} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
          {editingSeniorId ? "Edit Senior Member" : "Add Senior Member"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Name"
            value={seniorForm.name}
            onChange={(e) => setSeniorForm({ ...seniorForm, name: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="number"
            placeholder="S.No"
            value={seniorForm.s_no}
            onChange={(e) => setSeniorForm({ ...seniorForm, s_no: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="text"
            placeholder="Current Role (e.g. Software Engineer)"
            value={seniorForm.current_role}
            onChange={(e) => setSeniorForm({ ...seniorForm, current_role: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />
          <input
            type="text"
            placeholder="College"
            value={seniorForm.college}
            onChange={(e) => setSeniorForm({ ...seniorForm, college: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />
          <input
            type="url"
            placeholder="LinkedIn URL"
            value={seniorForm.linkedin_url}
            onChange={(e) => setSeniorForm({ ...seniorForm, linkedin_url: e.target.value })}
            className="rounded-lg border px-4 py-3 md:col-span-2"
          />
          <input
            type="url"
            placeholder="Image URL"
            value={seniorForm.image_url}
            onChange={(e) => setSeniorForm({ ...seniorForm, image_url: e.target.value })}
            className="rounded-lg border px-4 py-3 md:col-span-2"
          />
        </div>

        <div className="mt-6 flex gap-4">
          <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white hover:bg-opacity-90 transition">
            {editingSeniorId ? "Update Member" : "Add Member"}
          </button>
          {editingSeniorId && (
            <button
              type="button"
              onClick={resetSeniorForm}
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
              <th className="px-4 py-3 text-left">S.No</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">College</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seniorMembers.map((row) => (
              <tr key={row.id} className="border-b hover:bg-slate-50">
                <td className="px-5 py-3.5 text-sm font-bold text-[#0b3b8f]">{row.s_no}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.name}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.current_role || "-"}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.college || "-"}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingSeniorId(row.id);
                        setSeniorForm({
                          name: row.name,
                          s_no: row.s_no ? String(row.s_no) : "",
                          current_role: row.current_role || "",
                          college: row.college || "",
                          linkedin_url: row.linkedin_url || "",
                          image_url: row.image_url || "",
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSenior(row.id)}
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
