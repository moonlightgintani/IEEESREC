import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type ActivityRow = {
  id: number;
  s_no: number;
  event: string;
  date: string | null;
  chief_guest: string | null;
  participants: string | null;
  image_url: string | null;
};

export default function AdminActivities() {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);

  const [activityForm, setActivityForm] = useState({
    s_no: "",
    event: "",
    date: "",
    chief_guest: "",
    participants: "",
    image_url: "",
  });

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    setActivitiesError("");

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("s_no", { ascending: true });

    if (error) {
      setActivitiesError(error.message);
      setActivities([]);
    } else {
      setActivities(data || []);
    }

    setActivitiesLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const resetActivityForm = () => {
    setEditingActivityId(null);
    setActivityForm({
      s_no: "",
      event: "",
      date: "",
      chief_guest: "",
      participants: "",
      image_url: "",
    });
  };

  const submitActivity = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      s_no: Number(activityForm.s_no),
      event: activityForm.event.trim(),
      date: activityForm.date.trim() || null,
      chief_guest: activityForm.chief_guest.trim() || null,
      participants: activityForm.participants.trim() || null,
      image_url: activityForm.image_url.trim() || null,
    };

    if (!payload.s_no || !payload.event) {
      alert("S.No and Event are required");
      return;
    }

    if (editingActivityId) {
      const { error } = await supabase
        .from("activities")
        .update(payload)
        .eq("id", editingActivityId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("activities").insert([payload]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    resetActivityForm();
    fetchActivities();
  };

  const deleteActivity = async (id: number) => {
    const ok = window.confirm("Delete this activity?");
    if (!ok) return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchActivities();
  };

  const filteredActivities = useMemo(() => {
    const q = activitySearch.trim().toLowerCase();
    if (!q) return activities;

    return activities.filter((item) =>
      [
        item.s_no?.toString(),
        item.event,
        item.date,
        item.chief_guest,
        item.participants,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [activities, activitySearch]);

  return (
    <div className="space-y-8">
      <form onSubmit={submitActivity} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
          {editingActivityId ? "Edit Activity" : "Add New Activity"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input
            type="number"
            placeholder="S.No"
            value={activityForm.s_no}
            onChange={(e) => setActivityForm({ ...activityForm, s_no: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />

          <input
            type="text"
            placeholder="Event"
            value={activityForm.event}
            onChange={(e) => setActivityForm({ ...activityForm, event: e.target.value })}
            className="rounded-lg border px-4 py-3"
            required
          />

          <input
            type="text"
            placeholder="Date"
            value={activityForm.date}
            onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />

          <input
            type="text"
            placeholder="Chief Guest / Organizer"
            value={activityForm.chief_guest}
            onChange={(e) => setActivityForm({ ...activityForm, chief_guest: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />

          <input
            type="text"
            placeholder="Participants"
            value={activityForm.participants}
            onChange={(e) => setActivityForm({ ...activityForm, participants: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={activityForm.image_url}
            onChange={(e) => setActivityForm({ ...activityForm, image_url: e.target.value })}
            className="rounded-lg border px-4 py-3"
          />
        </div>

        <div className="mt-6 flex gap-4">
          <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white hover:bg-opacity-90 transition">
            {editingActivityId ? "Update Activity" : "Add Activity"}
          </button>

          {editingActivityId && (
            <button
              type="button"
              onClick={resetActivityForm}
              className="rounded-lg bg-slate-200 px-6 py-3 font-semibold hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-bold text-[#0b3b8f]">Activity Records</h3>

          <input
            type="text"
            placeholder="Search activities..."
            value={activitySearch}
            onChange={(e) => setActivitySearch(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 md:w-80"
          />
        </div>

        {activitiesLoading && <p className="text-slate-500">Loading activities...</p>}
        {!activitiesLoading && activitiesError && (
          <p className="text-red-600">Error: {activitiesError}</p>
        )}
        {!activitiesLoading && !activitiesError && filteredActivities.length === 0 && (
          <p className="text-slate-500">No activities found.</p>
        )}

        {!activitiesLoading && !activitiesError && filteredActivities.length > 0 && (
          <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">S.No</th>
                  <th className="px-4 py-3 text-left">Event</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Chief Guest</th>
                  <th className="px-4 py-3 text-left">Participants</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-slate-50">
                    <td className="px-5 py-3.5 text-sm text-slate-700">{row.s_no}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.event}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{row.date || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{row.chief_guest || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{row.participants || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingActivityId(row.id);
                            setActivityForm({
                              s_no: String(row.s_no),
                              event: row.event || "",
                              date: row.date || "",
                              chief_guest: row.chief_guest || "",
                              participants: row.participants || "",
                              image_url: row.image_url || "",
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteActivity(row.id)}
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
        )}
      </div>
    </div>
  );
}
