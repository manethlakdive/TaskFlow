export default function Profile() {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        My Profile
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl">
          A
        </div>

        <div>
          <p className="font-semibold">Amila Supun</p>
          <p className="text-sm text-gray-500">
            amila@example.com
          </p>
        </div>
      </div>

      <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Edit Profile
      </button>
    </div>
  );
}