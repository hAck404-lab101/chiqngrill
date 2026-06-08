"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { getAdminToken } from "@/lib/admin-api";

type AuditLog = {
  id: string;
  action: string;
  actor: string;
  details?: Record<string, unknown>;
  createdAt: string;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

function formatDetails(details?: Record<string, unknown>) {
  if (!details || Object.keys(details).length === 0) return "No extra details";
  return Object.entries(details).map(([key, value]) => `${key}: ${String(value)}`).join(" · ");
}

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadLogs() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` }
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Could not load audit logs");
      setLogs(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes("authentication")) router.replace("/admin/login");
      else setError(err instanceof Error ? err.message : "Could not load audit logs");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { void loadLogs(); }, []);

  return (
    <AdminShell title="Audit Logs" description="Track important system actions like orders, reservations, menu edits, settings changes, and kitchen status updates.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}

      <section className="rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">System Activity</h2>
            <p className="mt-1 text-sm font-semibold text-[#76675d]">Latest actions are shown first.</p>
          </div>
          <button type="button" onClick={() => void loadLogs()} className="rounded-full bg-[#241713] px-5 py-3 text-sm font-black text-white">Refresh</button>
        </div>

        {isLoading ? <p className="mt-5 text-sm font-bold text-[#76675d]">Loading audit logs...</p> : null}
        {!isLoading && logs.length === 0 ? <p className="mt-5 rounded-2xl bg-[#fff8ef] p-4 text-sm font-bold text-[#76675d]">No audit logs yet.</p> : null}

        <div className="mt-5 grid gap-3">
          {logs.map((log) => (
            <article key={log.id} className="rounded-[24px] bg-[#fff8ef] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-black text-[#16110d]">{log.action}</p>
                  <p className="mt-1 text-sm font-bold text-[#76675d]">Actor: {log.actor || "system"}</p>
                </div>
                <p className="text-xs font-black text-[#9d431f]">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "No date"}</p>
              </div>
              <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-[#76675d] ring-1 ring-black/5">{formatDetails(log.details)}</p>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
