import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import { trackEvent } from "./utils/tracking";

function HomePage() {
  useEffect(() => {
    trackEvent("page_visit");
  }, []);

  return (
    <>
      <Header />
      <Menu />
      <ChatWidget />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
