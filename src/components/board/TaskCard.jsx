export default function TaskCard({ task, columnId, onDragStart }) {
		return (
				<div
						draggable
						onDragStart={(e) => onDragStart(e, task.id, columnId)}
						className="bg-white	rounded-md	shadow-sm	p-3	mb-2	cursor-grab	active:cursor-grabbing	
hover:shadow-md	transition"
				>
						<p className="text-sm	text-gray-800">{task.title}</p>
				</div>
		);
    }