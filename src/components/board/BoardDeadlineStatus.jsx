import { useState, useEffect, useRef, useCallback } from "react";

const formatDuration = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(Math.abs(ms) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${hours}h`);
  if (days > 0 || hours > 0 || minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
};

const calcTaskProgress = (columns) => {
  if (!columns || columns.length === 0) return { percent: 0, done: 0, total: 0 };
  const total = columns.reduce((sum, c) => sum + c.tasks.length, 0);
  if (total === 0) return { percent: 0, done: 0, total: 0 };
  const doneColumn = columns.find((c) => c.id === "done") || columns[columns.length - 1];
  const done = doneColumn ? doneColumn.tasks.length : 0;
  return { percent: (done / total) * 100, done, total };
};

const MOTIVATIONAL_MESSAGES = [
  "Every task you finish moves this closer to done.",
  "Small steps today, big wins by the deadline.",
  "Your team is making real progress — keep the momentum.",
  "Consistency beats a last-minute rush. Nice work.",
  "One task at a time — you've got this.",
];

const TICKER_SPEED = 55; // px per second — pace eka mehen control karanna

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.5 1 2.5h6c0-1 .4-1.9 1-2.5A6 6 0 0 0 12 2z" />
  </svg>
);

export default function BoardDeadlineStatus({ createdAt, deadline, columns }) {
  const [now, setNow] = useState(new Date());
  const [messageIndex, setMessageIndex] = useState(0);
  const [seqWidth, setSeqWidth] = useState(0);

  const trackRef = useRef(null);
  const seqRef = useRef(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!deadline) return null;

  const created = new Date(createdAt);
  const due = new Date(deadline);

  const elapsedMs = now.getTime() - created.getTime();
  const remainingMs = due.getTime() - now.getTime();
  const isOverdue = remainingMs <= 0;
  const daysRemaining = Math.ceil(remainingMs / 86400000);

  const { percent: progressPercent } = calcTaskProgress(columns);
  const currentMessage = MOTIVATIONAL_MESSAGES[messageIndex];

  // ek lap eke width eka measure karanawa — message eka wenas unama width eka
  // wenas wenna puluwan nisa, message wenas wena moment eke remeasure karanawa
  const measure = useCallback(() => {
    if (seqRef.current) {
      const width = seqRef.current.getBoundingClientRect().width;
      if (width > 0) setSeqWidth(width);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, currentMessage]);

  // single copy scroll loop — duplicate widiyata dewenak render karanne na,
  // ek lap ekak (seqWidth eka) ivara unama offset eka 0 ekata reset wela,
  // ehema wenakota message eka ihata push karanawa
  useEffect(() => {
    const animate = (timestamp) => {
      if (lastTsRef.current === null) lastTsRef.current = timestamp;
      const deltaTime = Math.max(0, timestamp - lastTsRef.current) / 1000;
      lastTsRef.current = timestamp;

      if (seqWidth > 0) {
        offsetRef.current += TICKER_SPEED * deltaTime;
        if (offsetRef.current >= seqWidth) {
          offsetRef.current = 0;
          setMessageIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [seqWidth]);

  return (
    <div className="w-full max-w-sm rounded-2xl bg-indigo-950 py-3 px-5 shadow-sm overflow-hidden">
      <div className="ticker-viewport">
        <div className="ticker-seq" ref={trackRef}>
          <div className="ticker-seq-inner" ref={seqRef}>
            <span className="ticker-item">
              <span className="text-white/60"><ClockIcon /></span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
                Time Elapsed
              </span>
              <span className="text-sm font-bold tabular-nums text-white">
                {formatDuration(elapsedMs)}
              </span>
            </span>

            <span className="ticker-item">
              <span className="text-white/60"><TrendingUpIcon /></span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
                Progress
              </span>
              <span className="text-sm font-bold tabular-nums text-white">
                {progressPercent.toFixed(0)}%
              </span>
            </span>

            <span className="ticker-item">
              <span className={isOverdue ? "text-red-400" : "text-white/60"}>
                {isOverdue ? <AlertIcon /> : <CalendarIcon />}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
                {isOverdue ? "Overdue By" : "Time Remaining"}
              </span>
              <span className={`text-sm font-bold tabular-nums ${isOverdue ? "text-red-400" : "text-white"}`}>
                {Math.abs(daysRemaining)}d
              </span>
            </span>

            <span className="ticker-item">
              <span className="text-white/60"><LightbulbIcon /></span>
              <span className="text-sm font-medium text-white/90 whitespace-nowrap">
                {currentMessage}
              </span>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .ticker-viewport {
          overflow: hidden;
          width: 100%;
        }
        .ticker-seq {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
        }
        .ticker-seq-inner {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          gap: 2rem;
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-seq {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}