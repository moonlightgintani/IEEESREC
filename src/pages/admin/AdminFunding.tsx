import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type FundingSubmission = {
  id: number;
  title: string;
  submission_type: string;
  description: string | null;
  budget_amount: number | null;
  contact_email: string | null;
};

export default function AdminFunding() {
  const [fundingRequests, setFundingRequests] = useState<FundingSubmission[]>([]);
  const [editingFundingId, setEditingFundingId] = useState<number | null>(null);

  const [fundingForm, setFundingForm] = useState({
    title: "",
    submission_type: "Annual Plan",
    description: "",
    budget_amount: "",
    contact_email: "",
  });

  const fetchFundingRequests = async () => {
    const { data } = await supabase.from("funding_submissions").select("*").order("id", { ascending: false });
    setFundingRequests(data || []);
  };

  useEffect(() => {
    fetchFundingRequests();
  }, []);

  const resetFundingForm = () => {
    setEditingFundingId(null);
    setFundingForm({
      title: "",
      submission_type: "Annual Plan",
      description: "",
      budget_amount: "",
      contact_email: "",
    });
  };

  const submitFunding = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: fundingForm.title,
      submission_type: fundingForm.submission_type,
      description: fundingForm.description || null,
      budget_amount: Number(fundingForm.budget_amount) || null,
      contact_email: fundingForm.contact_email || null,
    };
    if (editingFundingId) {
      const { error } = await supabase.from("funding_submissions").update(payload).eq("id", editingFundingId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("funding_submissions").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetFundingForm();
    fetchFundingRequests();
  };

  const deleteFunding = async (id: number) => {
    const ok = window.confirm("Delete this funding request?");
    if (!ok) return;
    const { error } = await supabase.from("funding_submissions").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchFundingRequests();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submitFunding} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
          {editingFundingId ? "Edit Funding Request" : "Add Funding Request"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Title"
            value={fundingForm.title}
            onChange={(e) => setFundingForm({ ...fundingForm, title: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <select
            aria-label="Submission Type"
            value={fundingForm.submission_type}
            onChange={(e) => setFundingForm({ ...fundingForm, submission_type: e.target.value })}
            className="rounded-lg border px-4 py-3"
          >
            <option value="Annual Plan">Annual Plan</option>
            <option value="Event Funding">Event Funding</option>
            <option value="Special Project">Special Project</option>
          </select>
          <input
            type="number"
            placeholder="Budget Amount (Rs)"
            value={fundingForm.budget_amount}
            onChange={(e) => setFundingForm({ ...fundingForm, budget_amount: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <input
            type="email"
            placeholder="Contact Email"
            value={fundingForm.contact_email}
            onChange={(e) => setFundingForm({ ...fundingForm, contact_email: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />
          <textarea
            placeholder="Description"
            value={fundingForm.description}
            onChange={(e) => setFundingForm({ ...fundingForm, description: e.target.value })}
            className="rounded-lg border px-4 py-3 md:col-span-2"
            rows={3}
            required
          />
        </div>
        <div className="mt-6 flex gap-4">
          <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white hover:bg-opacity-90 transition">
            {editingFundingId ? "Update" : "Add"}
          </button>
          {editingFundingId && (
            <button
              type="button"
              onClick={resetFundingForm}
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
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Budget</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fundingRequests.map((row) => (
              <tr key={row.id} className="border-b hover:bg-slate-50">
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.title}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.submission_type}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">Rs. {row.budget_amount}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{row.contact_email}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingFundingId(row.id);
                        setFundingForm({
                          title: row.title,
                          submission_type: row.submission_type,
                          description: row.description || "",
                          budget_amount: String(row.budget_amount || ""),
                          contact_email: row.contact_email || "",
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFunding(row.id)}
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
