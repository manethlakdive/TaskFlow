export default function SidePanel({ isOpen, onClose, children }) {
  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`absolute top-0 left-0 h-full w-full sm:w-[40%] bg-slate-900/70 backdrop-blur-xl border-r border-white/10 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}