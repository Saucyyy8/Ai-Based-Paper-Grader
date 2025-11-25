import { useAuth } from "../context/AuthContext";

export default function StudentPage() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">AiPapergrader</p>
          <h1>Student Portal</h1>
          <p>{user?.email}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>
      <main>
        <section className="panel">
          <h2>Coming soon</h2>
          <p>
            The teacher portal handles OCR and grading for now. Students will
            eventually be able to track scores and feedback here.
          </p>
        </section>
      </main>
    </div>
  );
}


