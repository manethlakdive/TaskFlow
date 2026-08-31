# TaskFlow

A collaborative task board application (project name: **SyncBoard**) that lets a small team create boards, organise tasks into columns, and move work through stages such as To Do, Doing, and Done.

## Overview

TaskFlow is being built as a full-stack app using React on the front end, with a Node.js/Express + MongoDB back end planned for later milestones. Real-time sync between teammates will be added using Socket.io.

This repository currently contains:

- **Frontend** — React + Vite application (this folder)
- **Backend** — Express REST API with mock data (`/backend`)

## Tech Stack

- React (Vite)
- JavaScript (ES6+)
- CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/manethlakdive/TaskFlow.git
cd TaskFlow
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

> Note: Start the backend server first (see `/backend/README.md`) so the app can fetch live data instead of falling back to local state.

## Project Structure

```
TaskFlow/
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/        # React context providers
│   ├── data/            # Static/mock data
│   ├── pages/           # Page-level components
│   ├── App.jsx
│   └── main.jsx
├── backend/            # Express REST API
└── vite.config.js
```

## Status

This project is under active development as part of a coursework assignment. Current milestone: working REST API integration between frontend and backend.

## License

For academic use.