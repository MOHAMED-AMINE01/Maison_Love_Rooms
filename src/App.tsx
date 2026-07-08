import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/sections/Footer";
import FloatingSocials from "./components/layout/FloatingSocials";
import Home from "./pages/Home";
import { API_URL } from "./constants";
import { applyFontTheme, getCachedFontTheme, DEFAULT_FONT_THEME } from "./fontThemes";

// Lazy-loaded routes: kept out of the initial public bundle so the landing
// page loads as little JS as possible. Each chunk is fetched on navigation.
const SuiteDetail = lazy(() => import("./pages/SuiteDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Experience = lazy(() => import("./pages/Experience"));
const Boutique = lazy(() => import("./pages/Boutique"));
const CartesCadeaux = lazy(() => import("./pages/CartesCadeaux"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const Legal = lazy(() => import("./pages/Legal"));

// Admin area (~3.6k lines) is fully split out — visitors never download it.
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminReservations = lazy(() => import("./pages/admin/Reservations"));
const AdminChambres = lazy(() => import("./pages/admin/Chambres"));
const AdminDisponibilites = lazy(() => import("./pages/admin/Disponibilites"));
const AdminFormules = lazy(() => import("./pages/admin/Formules"));
const AdminBoutique = lazy(() => import("./pages/admin/Boutique"));
const AdminStock = lazy(() => import("./pages/admin/Stock"));
const AdminCommandes = lazy(() => import("./pages/admin/Commandes"));
const AdminCartesCadeaux = lazy(() => import("./pages/admin/CartesCadeaux"));
const AdminTypographie = lazy(() => import("./pages/admin/Typographie"));
const AdminFaq = lazy(() => import("./pages/admin/Faq"));
const AdminSettings = lazy(() => import("./pages/admin/Parametres"));

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

  // Applique le style typographique choisi en admin à tout le site client.
  // L'admin conserve le style par défaut pour rester lisible.
  useEffect(() => {
    if (isAdmin) {
      applyFontTheme(DEFAULT_FONT_THEME);
      return;
    }
    // Applique d'abord le dernier style mémorisé (zéro flash), puis synchronise
    // avec le serveur au cas où il aurait changé.
    applyFontTheme(getCachedFontTheme());
    fetch(`${API_URL}/api/settings`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.fontTheme) applyFontTheme(data.fontTheme);
      })
      .catch(() => {
        /* hors-ligne — on garde le style mémorisé */
      });
  }, [isAdmin]);

  return (
    <div className={`${isAdmin ? 'bg-admin-bg' : 'bg-page'} min-h-screen selection:bg-gold/20 relative overflow-x-hidden text-noir font-sans`}>
      <ScrollHandler />



      <div className={`transition-opacity duration-1000 ${(!isAdmin && loading) ? "opacity-0" : "opacity-100"}`}>
        {!isAdmin && <Navbar />}

        <main>
          <AnimatePresence mode="wait">
            <Suspense fallback={<div className={`min-h-screen ${isAdmin ? 'bg-admin-bg' : 'bg-page'}`} />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/suite/:id" element={<SuiteDetail />} />
              <Route path="/experience" element={<Experience />} />
              {/* Boutique et Cartes cadeaux : désormais des pages dédiées (onglets séparés) */}
              <Route path="/boutique" element={<Boutique />} />
              <Route path="/cartes-cadeaux" element={<CartesCadeaux />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/mentions-legales" element={<Legal />} />
              <Route path="/confidentialite" element={<Legal />} />
              <Route path="/cookies" element={<Legal />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>


                <Route index element={<AdminDashboard />} />
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="chambres" element={<AdminChambres />} />
                <Route path="disponibilites" element={<AdminDisponibilites />} />
                <Route path="formules" element={<AdminFormules />} />
                <Route path="prestations" element={<AdminBoutique />} />
                <Route path="boutique" element={<AdminBoutique />} />
                <Route path="stock" element={<AdminStock />} />
                <Route path="commandes" element={<AdminCommandes />} />
                <Route path="cartes-cadeaux" element={<AdminCartesCadeaux />} />
                <Route path="typographie" element={<AdminTypographie />} />
                <Route path="faq" element={<AdminFaq />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
            </Suspense>
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
