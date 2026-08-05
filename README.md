# 🏆 Hackathon Platform

An all-in-one platform designed to organize, manage, and participate in hackathons. Features distinct portal dashboards for Administrators, Organizers, Judges, and Participants, allowing seamless team creation, project submission, evaluation, and real-time leaderboard updates.

---

## 🚀 Key Features

*   **Multi-Role Architecture**: Specialized dashboards for **Administrators**, **Organizers**, **Judges**, and **Participants**.
*   **Hackathon Management**: Full CRUD operations for organizing hackathons, setting up timelines, guidelines, and rules.
*   **Team Manager**: Form teams, invite teammates, and manage roles within a project team.
*   **Project Submissions**: Standardized portals for submitting project details, repository links, demo URLs, and descriptions.
*   **Evaluation Engine**: Structured scoring interface for judges with category-specific criteria.
*   **Real-time Leaderboard**: Dynamically updated standings based on judges' inputs.
*   **Secure Authentication**: JWT-based authentication with role-based access control.

---

## 🛠️ Tech Stack

### Frontend
*   **Vite + React.js**: Fast, responsive UI library.
*   **Tailwind CSS**: Modern utility-first styling.
*   **Context API**: State management for user authentication.

### Backend
*   **Node.js & Express.js**: Fast, robust server application runtime.
*   **MongoDB & Mongoose**: Flexible, schema-based NoSQL database model.
*   **JSON Web Tokens (JWT)**: Secure user session management.

---

## 📂 Project Structure

```text
hackathon-platform/
├── backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Express handlers (Auth, Hackathons, Submissions, etc.)
│   ├── middleware/         # Security and error middlewares
│   ├── models/             # Mongoose schemas (User, Hackathon, Team, Submission, Evaluation)
│   ├── routes/             # REST endpoints mapping
│   ├── utils/              # Helper utilities (tokens, validation)
│   └── server.js           # Server entry point
└── frontend/
    ├── src/
    │   ├── components/     # Shared layout components (Navbar, ProtectedRoutes)
    │   ├── context/        # Authentication context state
    │   ├── pages/          # Dashboards and details pages (Auth, Hackathons, Teams, Leaderboards)
    │   └── services/       # API integration layer (Axios instance)
    ├── index.html          # Entry HTML page
    └── vite.config.js      # Vite compilation configurations
```

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (v16+)
*   MongoDB Instance (Local or MongoDB Atlas)

### Local Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/VenuVarma47/hackathon-platform.git
    cd hackathon-platform
    ```

2.  **Setup Backend environment**:
    Create a `.env` file inside the `backend` folder:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

3.  **Install dependencies and run Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```

4.  **Install dependencies and run Frontend**:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---

## 👥 Role Dashboards

*   **Admin**: Total platform governance, managing system configuration, and monitoring logs.
*   **Organizer**: Initiates hackathons, modifies details, lists requirements, and schedules submissions.
*   **Participant**: Joins or creates teams, browses ongoing hackathons, and submits projects.
*   **Judge**: Evaluates submissions based on technical and non-technical criteria and publishes feedback scores.
