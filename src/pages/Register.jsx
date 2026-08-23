import { Link } from "react-router-dom";
export default function Register() {}
return (
<div className="flex items-center justify-center min-h-screen bg-gray-50">
<div className="bg-white p-8 rounded-lg shadow-md w-80">
<h2 className="text-xl font-bold mb-4">Create Account</h2>
<input className="w-full border rounded px-3 py-2 mb-3" placeholder="Full Name" />
<input className="w-full border rounded px-3 py-2 mb-3" placeholder="Email" />
<input className="w-full border rounded px-3 py-2 mb-3" placeholder="Password"
type="password" />
<button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
Register
</button>
<p className="text-sm text-center mt-3">
Already have an account?{" "}
<Link to="/" className="text-indigo-600 hover:underline">
Login
</Link>
</p>
</div>
</div>
);