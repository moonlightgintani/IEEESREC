import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type OfficeBearer = {
  id: number;
  name: string;
  role: string;
  department: string | null;
  academic_year: string | null;
  year: number;
  group_name: string | null;
  image_url: string | null;
};

export default function AdminOfficeBearers() {
  const [officeRows, setOfficeRows] = useState<OfficeBearer[]>([]);
  const [editingOfficeId, setEditingOfficeId] = useState<number | null>(null);

  const [officeForm, setOfficeForm] = useState({
    name: "",
    role: "",
    department: "",
    academic_year: "2025-2026",
    year: "2025",
    group_name: "IEEE SB",
    image_url: "",
  });

  const fetchOfficeBearers = async () => {
    const { data } = await supabase
      .from("office_bearers")
      .select("*")
      .order("year", { ascending: false })
      .order("id", { ascending: true });

    setOfficeRows(data || []);
  };

  useEffect(() => {
    fetchOfficeBearers();
  }, []);

  const resetOfficeForm = () => {
    setEditingOfficeId(null);
    setOfficeForm({
      name: "",
      role: "",
      department: "",
      academic_year: "2025-2026",
      year: "2025",
      group_name: "IEEE SB",
      image_url: "",
    });
  };

  const submitOffice = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: officeForm.name.trim(),
      role: officeForm.role.trim(),
      department: officeForm.department.trim() || null,
      academic_year: officeForm.academic_year.trim() || null,
      year: Number(officeForm.year),
      group_name: officeForm.group_name.trim() || "IEEE SB",
      image_url: officeForm.image_url.trim() || null,
    };

    if (editingOfficeId) {
      const { data, error } = await supabase.from("office_bearers").update(payload).eq("id", editingOfficeId).select();
      if (error) {
        alert("Error: " + error.message);
        return;
      }
      if (!data || data.length === 0) {
        alert("UPDATE BLOCKED: You haven't run the SQL code in alter_schema.sql! Your database's Row Level Security is still blocking changes.");
        return;
      }
    } else {
      const { error } = await supabase.from("office_bearers").insert([payload]);
      if (error) {
        alert("Failed to insert office bearer: " + error.message);
        console.error(error);
        return;
      }
    }

    resetOfficeForm();
    fetchOfficeBearers();
  };

  const deleteOffice = async (id: number) => {
    const ok = window.confirm("Delete this office bearer?");
    if (!ok) return;
    const { data, error } = await supabase.from("office_bearers").delete().eq("id", id).select();
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      alert("DELETE BLOCKED: You haven't run the SQL code in alter_schema.sql! Your database's Row Level Security is still blocking changes.");
      return;
    }
    fetchOfficeBearers();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submitOffice} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
          {editingOfficeId ? "Edit Office Bearer" : "Add Office Bearer"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Name"
            value={officeForm.name}
            onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={officeForm.role}
            onChange={(e) => setOfficeForm({ ...officeForm, role: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="text"
            placeholder="Department"
            value={officeForm.department}
            onChange={(e) => setOfficeForm({ ...officeForm, department: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />
          <input
            type="number"
            placeholder="Year"
            value={officeForm.year}
            onChange={(e) => setOfficeForm({ ...officeForm, year: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />
          <input
            type="text"
            placeholder="Academic Year (e.g., 2025-2026)"
            value={officeForm.academic_year}
            onChange={(e) => setOfficeForm({ ...officeForm, academic_year: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />
          <input
            type="url"
            placeholder="Image URL"
            value={officeForm.image_url}
            onChange={(e) => setOfficeForm({ ...officeForm, image_url: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />
          <input
            type="text"
            placeholder="Group Name"
            value={officeForm.group_name}
            onChange={(e) => setOfficeForm({ ...officeForm, group_name: e.target.value })}
            className="rounded-lg border px-4 py-3 md:col-span-2"
          />
        </div>

        <div className="mt-6 flex gap-4">
          <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white hover:bg-opacity-90 transition">
            {editingOfficeId ? "Update" : "Add"}
          </button>
          {editingOfficeId && (
            <button
              type="button"
              onClick={resetOfficeForm}
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
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {officeRows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-slate-50">
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.name}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.role}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.department}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.year}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingOfficeId(row.id);
                        setOfficeForm({
                          name: row.name,
                          role: row.role,
                          department: row.department || "",
                          academic_year: row.academic_year || "",
                          year: String(row.year),
                          group_name: row.group_name || "IEEE SB",
                          image_url: row.image_url || "",
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteOffice(row.id)}
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
