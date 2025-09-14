export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      <span className="ml-2 text-sm text-gray-600">Loading…</span>
    </div>
  );
}
