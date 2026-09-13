import { useState, useEffect, useRef } from "react";
import SidePanel from "../common/SidePanel";

// board.deadline (ISO string) eka, datetime-local input ekata dagenna one
// format ekata convert karana helper eka (local time widiyata)
const toInputValue = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// deadline value eka "Sat, 20 Sept · 6:30 PM" wage user friendly preview ekata format karanawa
const formatPreview = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

// quick preset ekak select unama, ehe passe wena date eka calculate karala
// datetime-local format ekatama return karanawa
const presetToInputValue = (preset) => {
  const d = new Date();
  switch (preset) {
    case "today":
      d.setHours(23, 59, 0, 0);
      break;
    case "tomorrow":
      d.setDate(d.getDate() + 1);
      d.setHours(18, 0, 0, 0);
      break;
    case "3days":
      d.setDate(d.getDate() + 3);
      d.setHours(18, 0, 0, 0);
      break;
    case "1week":
      d.setDate(d.getDate() + 7);
      d.setHours(18, 0, 0, 0);
      break;
    case "2weeks":
      d.setDate(d.getDate() + 14);
      d.setHours(18, 0, 0, 0);
      break;
    default:
      return "";
  }
  return toInputValue(d.toISOString());
};

const PRESET_OPTIONS = [
  { value: "none", label: "No deadline" },
  { value: "today", label: "Today, end of day" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "3days", label: "In 3 days" },
  { value: "1week", label: "In 1 week" },
  { value: "2weeks", label: "In 2 weeks" },
  { value: "custom", label: "Custom date & time…" },
];

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const ChevronDownIcon = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// UI eke dark theme ekatama match wena, custom styled dropdown ekak —
// native <select> eke popup list eka browser eken control karana eka nisa
// (light background), meka button + absolutely positioned list ekakin hadala thiyenne
function DeadlineDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = PRESET_OPTIONS.find((opt) => opt.value === value) || PRESET_OPTIONS[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 border border-white/20 bg-white/5 text-white rounded px-3 py-2 hover:border-white/30 focus:outline-none focus:border-[#a5b4fc] transition-colors"
      >
        <span className="text-gray-400"><CalendarIcon /></span>
        <span className="flex-1 text-left text-sm">{selectedOption.label}</span>
        <span className="text-gray-400"><ChevronDownIcon open={open} /></span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full rounded-lg border border-white/10 bg-[#181530] shadow-xl shadow-black/40 py-1.5 overflow-hidden">
          {PRESET_OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  isSelected ? "bg-[#a5b4fc]/15 text-[#c7d0fe]" : "text-gray-200 hover:bg-white/5"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <CheckIcon />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BoardFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  initialName = "",
  initialDescription = "",
  initialDeadline = null,
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [deadline, setDeadline] = useState(toInputValue(initialDeadline));
  const [preset, setPreset] = useState(initialDeadline ? "custom" : "none");

  useEffect(() => {
    setName(initialName || "");
    setDescription(initialDescription || "");
    setDeadline(toInputValue(initialDeadline));
    setPreset(initialDeadline ? "custom" : "none");
  }, [initialName, initialDescription, initialDeadline, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      // input eken enne local time widiyata, ISO ekata convert karala evanawa
      deadline: deadline ? new Date(deadline).toISOString() : null,
    });
  };

  const handlePresetChange = (value) => {
    setPreset(value);
    if (value === "none") {
      setDeadline("");
    } else if (value === "custom") {
      // custom pennanawa, ithin thiyena value eka change karanne na —
      // user ta thamange datetime-local eken hariyata select karanna puluwan
    } else {
      setDeadline(presetToInputValue(value));
    }
  };

  // datetime-local input eke min attribute ekata - atita ekata deadline dagannna
  // one nathi nisa, "dan" (now) eka witharai allow karanawa
  const nowMinValue = toInputValue(new Date().toISOString());

  return (
    <SidePanel isOpen={isOpen} onClose={onClose}>
      <div className="h-full flex flex-col p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg leading-none" aria-label="Close">✕</button>

        <h2 className="text-2xl font-bold mb-6 mt-8 text-white">
          {mode === "create" ? "Create New Board" : "Edit Board"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc]"
            placeholder="Board name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <textarea
            className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc] resize-none"
            placeholder="Description (optional)"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-sm font-medium text-white px-1">
              Project deadline
            </label>

            <DeadlineDropdown value={preset} onChange={handlePresetChange} />

            {preset === "custom" && (
              <input
                type="datetime-local"
                className="w-full border border-white/20 bg-white/5 text-white rounded px-3 py-2 mt-1 focus:outline-none focus:border-[#a5b4fc] [color-scheme:dark]"
                value={deadline}
                min={nowMinValue}
                onChange={(e) => setDeadline(e.target.value)}
              />
            )}

            {preset !== "none" && (
              <span className="text-xs text-gray-400 px-1 mt-1">
                {deadline ? formatPreview(deadline) : "Pick a date and time"}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="text-white py-2 rounded mt-2 transition-colors"
            style={{ backgroundColor: "#a5b4fc" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8b9cf7")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#a5b4fc")}
          >
            {mode === "create" ? "Create Board" : "Save Changes"}
          </button>
        </form>
      </div>
    </SidePanel>
  );
}