export default function TaskCard({ task, columnId, onDragStart, onOpen }) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id, columnId)}
      onClick={() => onOpen(task)}
            className="bg-white rounded-md shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition w-full"
    >
      <p className="text-sm text-gray-800">{task.title}</p>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}
    </div>
  );
}