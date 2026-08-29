import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger / Close button - fixed top-right corner, always on right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 w-10 h-10 rounded-full bg-black flex items-center justify-center z-50 focus:outline-none"
        aria-label="Toggle menu"
      >
        <span
          className={`absolute h-0.5 w-5 bg-white rounded transition-all duration-300 ${
            isOpen ? "rotate-45" : "-translate-y-1.5"
          }`}
        />
        <span
          className={`absolute h-0.5 w-5 bg-white rounded transition-all duration-300 ${
            isOpen ? "-rotate-45" : "translate-y-1.5"
          }`}
        />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[40%] bg-black text-white z-40 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 p-8 mt-16 text-lg">
          <h1 className="font-bold text-lg mb-4">TaskFlow</h1>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:underline">
            Dashboard
          </Link>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="hover:underline">
            Profile
          </Link>
        </div>
      </div>
    </>
  );
}