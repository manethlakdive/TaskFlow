import { mockMembers } from "../../data/mockData";

export default function MemberAvatarList() {
  return (
    <div className="flex -space-x-2">
      {mockMembers.map((m) => (
        <div
          key={m.id}
          title={m.name}
          className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs border-2 border-white"
        >
          {m.name.charAt(0)}
        </div>
      ))}
    </div>
  );
}