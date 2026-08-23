import { Link	} from "react-router-dom";
export default function Navbar() {
		return (
				<nav className="bg-indigo-600	text-white	px-6	py-3	flex	justify-between	items-center">
						<h1 className="font-bold	text-lg">SyncBoard</h1>
						<div className="flex	gap-4	text-sm">
								<Link to="/dashboard" className="hover:underline">Dashboard</Link>
								<Link to="/profile" className="hover:underline">Profile</Link>
						</div>
				</nav>
		);
}