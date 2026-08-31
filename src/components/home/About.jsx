import AccordionGallery from "../effects/AccordionGallery/AccordionGallery";

const steps = [
  {
    image: "https://picsum.photos/id/1015/900/1200",
    label: "Create a Board",
  },
  {
    image: "https://picsum.photos/id/1018/900/1200",
    label: "Invite Your Team",
  },
  {
    image: "https://picsum.photos/id/1043/900/1200",
    label: "Track Progress",
  },
  

];

export default function About() {
  return (
    <section
      id="about"
      className="relative -mt-10 rounded-t-[40px] overflow-hidden py-16 px-6"
      style={{ backgroundColor: "#a5b4fc" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.3fr] gap-4 items-center">
        {/* Left side - text */}
        <div className="md:pr-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-950">
            About TaskFlow
          </h2>

          <div className="space-y-4 text-indigo-900/80 text-sm md:text-base">
            <p>
              TaskFlow is a full-stack collaborative task management platform designed to help
              teams organize, manage, and track their work through a centralized digital
              workspace.
            </p>
            <p>
              The platform provides a structured Kanban-style workflow where users can create,
              update, and manage tasks across different stages such as To Do, Doing, and Done.
              Real-time updates allow team members to stay synchronized as changes are made to
              shared tasks and boards.
            </p>
            <p>
              TaskFlow is built with a focus on reliability, collaboration, and maintainability,
              incorporating secure authentication, persistent data storage, client-side
              persistence, conflict detection, automated testing, and containerized deployment.
            </p>
          </div>
        </div>

        {/* Right side - accordion gallery */}
        <div className="md:pl-4">
          <AccordionGallery
            items={steps}
            defaultIndex={0}
            accentColor="#a5b4fc"
            overlayColor="#1e1b4b"
            textColor="#ffffff"
            height={460}
          />
        </div>
      </div>
    </section>
  );
}