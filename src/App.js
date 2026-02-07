import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import useSplitTextGSAP from "./animations/useSplitTextGSAP";
import Footer from "./components/Footer";
export default function App() {
   useSplitTextGSAP(); 
  return (
    <div className="min-h-screen ">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
