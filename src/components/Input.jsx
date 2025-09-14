export function Input({ label, ...props }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <input
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/40"
        {...props}
      />
    </label>
  );
}
