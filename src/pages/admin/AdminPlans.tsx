import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AnnualPlan = {
  id: number;
  s_no: number;
  event: string;
  sub_event: string | null;
  schedule: string;
};

export default function AdminPlans() {
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>([]);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);

  const [planForm, setPlanForm] = useState({
    s_no: "",
    event: "",
    sub_event: "",
    schedule: "",
  });

  const fetchAnnualPlans = async () => {
    const { data } = await supabase.from("annual_plan").select("*").order("s_no", { ascending: true });
    setAnnualPlans(data || []);
  };

  useEffect(() => {
    fetchAnnualPlans();
  }, []);

  const resetPlanForm = () => {
    setEditingPlanId(null);
    setPlanForm({ s_no: "", event: "", sub_event: "", schedule: "" });
  };

  const submitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      s_no: Number(planForm.s_no),
      event: planForm.event,
      sub_event: planForm.sub_event || null,
      schedule: planForm.schedule,
    };
    if (editingPlanId) {
      const { error } = await supabase.from("annual_plan").update(payload).eq("id", editingPlanId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("annual_plan").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetPlanForm();
    fetchAnnualPlans();
  };

  const deletePlan = async (id: number) => {
    const ok = window.confirm("Delete this annual plan?");
    if (!ok) return;
    const { error } = await supabase.from("annual_plan").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchAnnualPlans();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submitPlan} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
          {editingPlanId ? "Edit Annual Plan" : "Add Annual Plan"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="number"
            placeholder="S.No"
            value={planForm.s_no}
            onChange={(e) => setPlanForm({ ...planForm, s_no: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="text"
            placeholder="Event"
            value={planForm.event}
            onChange={(e) => setPlanForm({ ...planForm, event: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="text"
            placeholder="Sub Event (Optional)"
            value={planForm.sub_event}
            onChange={(e) => setPlanForm({ ...planForm, sub_event: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />
          <input
            type="text"
            placeholder="Schedule"
            value={planForm.schedule}
            onChange={(e) => setPlanForm({ ...planForm, schedule: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
        </div>
        <div className="mt-6 flex gap-4">
          <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white hover:bg-opacity-90 transition">
            {editingPlanId ? "Update" : "Add"}
          </button>
          {editingPlanId && (
            <button
              type="button"
              onClick={resetPlanForm}
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
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3 text-left">Sub Event</th>
              <th className="px-4 py-3 text-left">Schedule</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {annualPlans.map((row) => (
              <tr key={row.id} className="border-b hover:bg-slate-50">
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.s_no}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.event}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.sub_event || "-"}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.schedule}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPlanId(row.id);
                        setPlanForm({
                          s_no: String(row.s_no),
                          event: row.event,
                          sub_event: row.sub_event || "",
                          schedule: row.schedule,
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePlan(row.id)}
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
