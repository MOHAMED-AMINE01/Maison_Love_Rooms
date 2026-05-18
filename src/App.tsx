import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/sections/Footer";
import FloatingSocials from "./components/layout/FloatingSocials";
import Home from "./pages/Home";
import SuiteDetail from "./pages/SuiteDetail";
import Checkout from "./pages/Checkout";
import Experience from "./pages/Experience";
import Confirmation from "./pages/Confirmation";
import Legal from "./pages/Legal";
import CartesCadeaux from "./pages/CartesCadeaux";
import AdminLayout from "./components/layout/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";

import AdminReservations from "./pages/admin/Reservations";
import AdminChambres from "./pages/admin/Chambres";
import AdminDisponibilites from "./pages/admin/Disponibilites";
import AdminBoutique from "./pages/admin/Boutique";
import AdminCartesCadeaux from "./pages/admin/CartesCadeaux";
import AdminSettings from "./pages/admin/Parametres";

// Scroll handling component
function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is no hash, scroll to top
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // If there is a hash, scroll to the element
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Wait a bit for the page to render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname, hash]);

  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`${isAdmin ? 'bg-admin-bg' : 'bg-page'} min-h-screen selection:bg-gold/20 relative overflow-x-hidden text-noir font-sans`}>
      <ScrollHandler />



      <div className={`transition-opacity duration-1000 ${(!isAdmin && loading) ? "opacity-0" : "opacity-100"}`}>
        {!isAdmin && <Navbar />}

        <main>
          <AnimatePresence mode="wait">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/suite/:id" element={<SuiteDetail />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/cartes-cadeaux" element={<CartesCadeaux />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/mentions-legales" element={<Legal />} />
              <Route path="/cgv" element={<Legal />} />
              <Route path="/confidentialite" element={<Legal />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>


                <Route index element={<AdminDashboard />} />
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="chambres" element={<AdminChambres />} />
                <Route path="disponibilites" element={<AdminDisponibilites />} />
                <Route path="prestations" element={<AdminBoutique />} />
                <Route path="boutique" element={<AdminBoutique />} />
                <Route path="cartes-cadeaux" element={<AdminCartesCadeaux />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </main>

        {!isAdmin && <Footer />}
        {!isAdmin && <FloatingSocials />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
