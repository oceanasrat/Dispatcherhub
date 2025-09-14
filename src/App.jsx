import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import StatusBadge from "./components/StatusBadge";
import Spinner from "./components/Spinner";
import { fmtMoney } from "./utils/format";

const STATUS = ["booked", "in_transit", "delivered", "invoiced", "paid"];

export default function App() {
  const [tab, setTab] = useState("loads");
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">DispatcherHub</h1>
          <nav className="flex gap-2">
            <button
              className={`tab ${tab === "loads" ? "tab-active" : ""}`}
              onClick={() => setTab("loads")}
            >
              Loads
            </button>
            <button
              className={`tab ${tab === "invoices" ? "tab-active" : ""}`}
              onClick={() => setTab("invoices")}
            >
              Invoices
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        {tab === "loads" ? <LoadsView /> : <InvoicesView />}
      </main>
    </div>
  );
}

function LoadsView() {
  const [rows, setRows] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState("");

  async function fetchLoads() {
    setMsg("");
    let q = supabase.from("loads").select("id,origin,destination,rate,status").order("id", { ascending: true });
    if (origin) q = q.ilike("origin", `%${origin}%`);
    if (destination) q = q.ilike("destination", `%${destination}%`);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) {
      setRows([]);
      setMsg(`Error: ${error.message}`);
      return;
    }
    setRows(data);
  }

  useEffect(() => {
    fetchLoads();
  }, []); // initial load

  async function updateStatus(id, next) {
    setBusyId(id);
    setMsg("");
    const { error } = await supabase.from("loads").update({ status: next }).eq("id", id);
    setBusyId(null);
    if (error) {
      setMsg(`Update failed: ${error.message}`);
    } else {
      setMsg(`Updated load ${id} → ${next}`);
      fetchLoads();
    }
  }

  const hasFilters = useMemo(() => origin || destination || status, [origin, destination, status]);

  return (
    <div className="space-y-4">
      {/* Filters / Actions */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Origin</label>
          <input
            placeholder="e.g. Dallas"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Destination</label>
          <input
            placeholder="e.g. Austin"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All status</option>
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <button onClick={fetchLoads} className="btn-primary">Refresh</button>
        <button
          onClick={async () => {
            setMsg("");
            const { error } = await supabase
              .from("loads")
              .insert([{ origin: "Origin", destination: "Destination", rate: 0, status: "booked" }]);
            if (error) setMsg(`Create failed: ${error.message}`);
            else fetchLoads();
          }}
        >
          Create Load
        </button>
        {hasFilters ? (
          <button onClick={() => { setOrigin(""); setDestination(""); setStatus(""); fetchLoads(); }}>
            Clear Filters
          </button>
        ) : null}
      </div>

      {/* Feedback */}
      {msg ? (
        <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
          {msg}
        </div>
      ) : null}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table>
          <thead>
            <tr>
              <th className="w-14">ID</th>
              <th>Origin</th>
              <th>Destination</th>
              <th className="w-32">Rate</th>
              <th className="w-32">Status</th>
              <th className="w-[280px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {!rows ? (
              <tr>
                <td colSpan={6}><Spinner /></td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                  No loads match your filter.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-gray-500">{r.id}</td>
                  <td>{r.origin}</td>
                  <td>{r.destination}</td>
                  <td>{fmtMoney(r.rate)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      {/* WORKING status dropdown */}
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className="w-[150px]"
                        disabled={busyId === r.id}
                      >
                        {STATUS.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>

                      {/* Convenience button */}
                      <button
                        className="btn-primary"
                        disabled={busyId === r.id || r.status === "delivered"}
                        onClick={() => updateStatus(r.id, "delivered")}
                      >
                        {busyId === r.id ? "Saving…" : "Mark Delivered"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoicesView() {
  // Minimal placeholder so your tab still works. You already have a page for this;
  // leave as-is or replace with your existing Invoices component.
  const [rows, setRows] = useState(null);

  async function fetchInvoices() {
    const { data, error } = await supabase
      .from("invoices")
      .select("id, load_id, amount, factoring, paid_at")
      .order("id", { ascending: true });
    if (error) setRows([]);
    else setRows(data || []);
  }

  useEffect(() => { fetchInvoices(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <button onClick={fetchInvoices} className="btn-primary">Refresh</button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table>
          <thead>
            <tr>
              <th className="w-14">ID</th>
              <th>Load</th>
              <th className="w-32">Amount</th>
              <th className="w-28">Factoring</th>
              <th className="w-36">Paid at</th>
            </tr>
          </thead>
          <tbody>
            {!rows ? (
              <tr><td colSpan={5}><Spinner /></td></tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  No invoices yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-gray-500">{r.id}</td>
                  <td>#{r.load_id}</td>
                  <td>{fmtMoney(r.amount)}</td>
                  <td>{r.factoring ? "Yes" : "No"}</td>
                  <td>{r.paid_at ? new Date(r.paid_at).toLocaleString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
