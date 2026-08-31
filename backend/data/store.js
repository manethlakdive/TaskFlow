// In-memory "database". No real DB is used for this assignment stage —
// everything resets when the server restarts. This is intentional: the
// goal here is "Working REST APIs with mock data", not persistence.

export const users = [
  { id: "u1", name: "Amila Supun", email: "amila@example.com", password: "123456" },
  { id: "u2", name: "Maneth Lakdiv", email: "maneth@example.com", password: "123456" },
];

export const members = [
  { id: "m1", name: "Amila Supun", email: "amila@example.com" },
  { id: "m2", name: "Maneth Lakdiv", email: "maneth@example.com" },
  { id: "m3", name: "Nipun", email: "nipun@example.com" },
];

export const columns = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "1", title: "Design database schema" },
      { id: "2", title: "Set up GitHub repo" },
    ],
  },
  {
    id: "doing",
    title: "Doing",
    tasks: [{ id: "3", title: "Build Board component" }],
  },
  {
    id: "done",
    title: "Done",
    tasks: [{ id: "4", title: "Create Vite project" }],
  },
];

// simple id generator for new tasks/members created via POST
let idCounter = 100;
export const nextId = () => String(idCounter++);
