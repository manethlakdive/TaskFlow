export default function Hero() {
  return (
    <div className="bg-indigo-600 text-white rounded-2xl mx-4 mt-4 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Text content */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Organize Your Work with TaskFlow
        </h1>
        <p className="text-indigo-100 text-base md:text-lg mb-6 max-w-md">
          Plan, track, and manage your team's tasks in one simple, powerful board.
        </p>
        <button className="bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-100 transition-colors">
          Get Started
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex justify-center">
        <svg
          viewBox="0 0 400 300"
          className="w-full max-w-xs md:max-w-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Board background */}
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#ffffff" opacity="0.15" />

          {/* Column 1 */}
          <rect x="60" y="60" width="90" height="180" rx="10" fill="#ffffff" opacity="0.2" />
          <rect x="72" y="75" width="66" height="16" rx="4" fill="#ffffff" opacity="0.9" />
          <rect x="72" y="100" width="66" height="40" rx="6" fill="#ffffff" opacity="0.6" />
          <rect x="72" y="150" width="66" height="40" rx="6" fill="#ffffff" opacity="0.6" />

          {/* Column 2 */}
          <rect x="165" y="60" width="90" height="180" rx="10" fill="#ffffff" opacity="0.2" />
          <rect x="177" y="75" width="66" height="16" rx="4" fill="#ffffff" opacity="0.9" />
          <rect x="177" y="100" width="66" height="60" rx="6" fill="#ffffff" opacity="0.6" />

          {/* Column 3 */}
          <rect x="270" y="60" width="90" height="180" rx="10" fill="#ffffff" opacity="0.2" />
          <rect x="282" y="75" width="66" height="16" rx="4" fill="#ffffff" opacity="0.9" />
          <rect x="282" y="100" width="66" height="30" rx="6" fill="#ffffff" opacity="0.6" />
          <rect x="282" y="140" width="66" height="30" rx="6" fill="#ffffff" opacity="0.6" />
          <rect x="282" y="180" width="66" height="30" rx="6" fill="#ffffff" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}