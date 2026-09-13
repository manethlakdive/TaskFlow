import { useState, useEffect } from "react";

export default function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const time = `${hours}:${minutes}:${seconds} ${ampm}`;

  return (
    <div
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/90"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <span className="font-medium">{date}</span>
      <span className="text-white/40">•</span>
      <span>{time}</span>
    </div>
  );
}