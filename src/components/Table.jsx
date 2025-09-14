export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  );
}

export function Th({ children }) {
  return (
    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {children}
    </th>
  );
}

export function Td({ children }) {
  return (
    <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">{children}</td>
  );
}
