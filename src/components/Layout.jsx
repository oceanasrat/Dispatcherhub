import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LayoutGrid, FileText, Truck, FileUp, Settings, PanelLeft } from "lucide-react";
import { useSupabaseUser } from "../hooks/useSupabaseUser";
import AuthMenu from "./AuthMenu"; // shows Sign in / Sign out

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        "smooth press flex items-center gap-2 px-3 py-2 rounded-xl " +
        (isActive ? "bg-blue-600 text-white shadow" : "hover:bg-white text-gray-700")
      }
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { user } = useSupabaseUser();

  return (
    <div className="min-h-screen">
      {/* Glassy topbar */}
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(!open)}
              className="sm:hidden p-2 rounded hover:bg-white smooth"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="font-semibold text-gray-900">DispatcherHub</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs text-gray-600">
              {user?.email ? `Signed in: ${user.email}` : "Not signed in"}
            </div>
            <AuthMenu />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4">
        {/* Gradient sidebar */}
        <aside
          className={
            "sm:sticky sm:top-16 sm:block w-64 shrink-0 h-max rounded-2xl p-2 border smooth " +
            "bg-gradient-to-b from-white to-slate-100 " +
            (open ? "block" : "hidden sm:block")
          }
        >
          <div className="flex items-center gap-2 px-2 pb-2 text-xs text-gray-500">
            <PanelLeft size={16} />
            Navigation
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem to="/board" icon={LayoutGrid} label="Board" onClick={() => setOpen(false)} />
            <NavItem to="/loads" icon={Truck} label="Loads" onClick={() => setOpen(false)} />
            <NavItem to="/invoices" icon={FileText} label="Invoices" onClick={() => setOpen(false)} />
            <NavItem to="/documents" icon={FileUp} label="Documents" onClick={() => setOpen(false)} />
            <NavItem to="/admin" icon={Settings} label="Admin" onClick={() => setOpen(false)} />
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
