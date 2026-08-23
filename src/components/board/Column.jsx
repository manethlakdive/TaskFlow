import TaskCard from "./TaskCard";

export default function Column({ column, onDragStart, onDrop }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, column.id)}
      className="bg-gray-100 rounded-lg p-3 w-64 flex-shrink-0 min-h-[300px]"
    >
      <h3 className="font-semibold text-gray-700 mb-3">
        {column.title}
      </h3>

      {column.tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          columnId={column.id}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}