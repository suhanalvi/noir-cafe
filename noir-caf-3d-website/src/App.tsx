import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import { Atmosphere } from "./components/ui";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CoffeeLab from "./pages/CoffeeLab";
import OurStory from "./pages/OurStory";
import Experience from "./pages/Experience";
import Visit from "./pages/Visit";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/coffee-lab" element={<CoffeeLab />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-cream focus:px-4 focus:py-2 focus:text-coal"
      >
        Skip to content
      </a>
      <SiteNav />
      <div id="content">
        <AnimatedRoutes />
      </div>
      <SiteFooter />
      <Atmosphere />
    </BrowserRouter>
  );
}
