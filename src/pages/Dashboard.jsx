import { useState } from "react";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import Hero from "../components/common/Hero";
import Board from "../components/board/Board";
import InviteMemberModal from "../components/team/InviteMemberModal";
import MemberAvatarList from "../components/team/MemberAvatarList";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div>
      <DashboardNavbar />

      <Hero
        greeting={`Hey, ${user?.name ?? "there"}`}
        heading="Keep Your Team in FLOW"
        rotatingTexts={["Plan", "Collaborate", "Track", "Complete"]}
        subtitle="Everything your team needs to plan work, track progress, and get things done together."
        buttonText="+ Create New Board"
        onButtonClick={() => {
          // TODO: create-board flow
        }}
      />

      <div className="flex justify-between items-center px-4 pt-4">
        <h2 className="text-xl font-bold">SyncBoard</h2>
        <div className="flex items-center gap-3">
          <MemberAvatarList />
          <button
            onClick={() => setInviteOpen(true)}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
          >
            + Invite
          </button>
        </div>
      </div>

      <Board />
      <InviteMemberModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
