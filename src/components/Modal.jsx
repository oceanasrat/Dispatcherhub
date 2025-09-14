export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
          <div className="border-b px-5 py-3 text-lg font-semibold">{title}</div>
          <div className="px-5 py-4">{children}</div>
          {footer && <div className="border-t px-5 py-3 bg-gray-50">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
