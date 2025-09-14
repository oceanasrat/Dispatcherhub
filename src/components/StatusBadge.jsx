export default function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  const styles = {
    booked:     "bg-gray-200 text-gray-800",
    in_transit: "bg-blue-100 text-blue-800",
    delivered:  "bg-green-100 text-green-800",
    invoiced:   "bg-amber-100 text-amber-800",
    paid:       "bg-emerald-100 text-emerald-800",
  };
  const label = s.replace(/_/g, " ");
  const cls = styles[s] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {label || "unknown"}
    </span>
  );
}
