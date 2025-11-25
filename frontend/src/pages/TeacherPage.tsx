import { useState } from "react";

import GradingPanel from "../components/GradingPanel";
import TestBuilder from "../components/TestBuilder";
import type { Question } from "../api/tests";
import { useAuth } from "../context/AuthContext";

export default function TeacherPage() {
  const [selection, setSelection] = useState<Question | null>(null);
  const { logout, user } = useAuth();

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">AiPapergrader</p>
          <h1>Teacher Workspace</h1>
          <p>{user?.email}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>
      <main>
        <TestBuilder onQuestionSelect={setSelection} />
        <GradingPanel question={selection} />
      </main>
    </div>
  );
}

