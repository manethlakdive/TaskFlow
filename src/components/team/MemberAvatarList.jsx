import { useState, useEffect } from "react";

const API_URL = "http://localhost:5001/api";

export default function MemberAvatarList() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data.members));
  }, []);

  return (
    <div className="flex -space-x-2">
      {members.map((m) => (
        <div key={m.id} title={m.name} className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs border-2 border-white">
          {m.name.charAt(0)}
        </div>
      ))}
    </div>
  );
}