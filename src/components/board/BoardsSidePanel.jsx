import SidePanel from "../common/SidePanel";

export default function BoardsSidePanel({
  isOpen,
  onClose,
  boards,
  onOpen,
  onRename,
  onDelete,
}) {
  return (
    <SidePanel isOpen={isOpen} onClose={onClose}>
      <div className="h-full flex flex-col p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mt-8 mb-6">My Boards</h2>

        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          {boards.length === 0 ? (
            <p className="text-gray-400 text-sm">You don't have any boards yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between gap-3"
                >
                  <h3
                    onClick={() => onOpen(board.id)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onRename(board);
                    }}
                    title={board.description || board.name}
                    className="font-semibold text-white cursor-pointer hover:scale-105 transition-transform origin-left truncate"
                  >
                    {board.name}
                  </h3>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(board.id);
                      }}
                      aria-label="Delete board"
                      className="text-white hover:text-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidePanel>
  );
}