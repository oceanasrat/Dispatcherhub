import { Routes, Route } from "react-router-dom";

import LoadsPro from "./pages/LoadsPro";
import InvoicesPro from "./pages/InvoicesPro";
import Documents from "./pages/Documents";
import DriverPortal from "./pages/DriverPortal";
import Admin from "./pages/Admin";
import TestLogin from "./pages/TestLogin";
import NotFound from "./pages/NotFound";
import Board from "./pages/Board";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoadsPro />} />
      <Route path="/board" element={<Board />} />
      <Route path="/loads" element={<LoadsPro />} />
      <Route path="/invoices" element={<InvoicesPro />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/driver" element={<DriverPortal />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
