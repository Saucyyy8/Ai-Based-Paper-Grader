import { useState } from "react";
import type { FormEvent } from "react";

import { gradeSubmission } from "../api/tests";
import type { Question, ScoreResponse } from "../api/tests";

type Props = {
  question: Question | null;
};

export default function GradingPanel({ question }: Props) {
  const [form, setForm] = useState({
    student_name: "",
    student_answer_text: "",
    student_answer_image: null as File | null,
  });
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!question) {
    return (
      <section className="panel">
        <p>Select a question to start grading.</p>
      </section>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await gradeSubmission(question.id, {
        student_name: form.student_name,
        student_answer_text: form.student_answer_text || undefined,
        student_answer_image: form.student_answer_image ?? undefined,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to grade submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <header>
        <p className="eyebrow">Phase 2 · Grading</p>
        <h2>Evaluate student response</h2>
      </header>
      <form className="question-form" onSubmit={handleSubmit}>
        <label>
          Student name
          <input
            value={form.student_name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, student_name: e.target.value }))
            }
            required
          />
        </label>
        <label>
          Student answer
          <textarea
            value={form.student_answer_text}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, student_answer_text: e.target.value }))
            }
            rows={4}
            placeholder="Paste student answer or upload an image below..."
          />
        </label>
        <label className="file">
          or upload image
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                student_answer_image: e.target.files?.[0] ?? null,
              }))
            }
          />
        </label>
        <button disabled={loading} type="submit">
          {loading ? "Grading..." : "Grade now"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="score-card">
          <p className="score">{result.normalized_score}%</p>
          <p>Similarity score: {result.similarity_score.toFixed(3)}</p>
          <details>
            <summary>Model vs student text</summary>
            <div className="compare">
              <div>
                <h4>Model Answer</h4>
                <p>{result.model_answer}</p>
              </div>
              <div>
                <h4>Student Answer</h4>
                <p>{result.student_answer}</p>
              </div>
            </div>
          </details>
        </div>
      )}
    </section>
  );
}

