import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fmtMoney } from "../utils/format";

export default function InvoicesView() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchInvoices() {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("id, load_id, amount, factoring, paid_at")
      .order("id", { ascending: true });
    if (error) {
      console.error("invoices fetch error:", error.message);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchInvoices();

    // 🔴 live updates (insert/update/delete)
    const channel = supabase
      .channel("invoices-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices" },
        () => fetchInvoices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={fetchInvoices} className="btn-primary">Refresh</button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow border border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Load</th>
              <th>Amount</th>
              <th>Factoring</th>
              <th>Paid at</th>
            </tr>
          </thead>
          <tbody>
            {!rows?.length && !loading && (
              <tr>
                <td colSpan="5" className="px-3 py-6 text-center text-sm text-gray-500">
                  No invoices yet.
                </td>
              </tr>
            )}
            {rows?.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>#{r.load_id}</td>
                <td>{fmtMoney(r.amount)}</td>
                <td>{r.factoring ? "Yes" : "No"}</td>
                <td>{r.paid_at ? new Date(r.paid_at).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Tip: Changing a load to <b>invoiced</b> should auto-create an invoice if your DB trigger is active.
      </p>
    </div>
  );
}

