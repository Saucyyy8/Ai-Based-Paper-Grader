import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  createQuestion,
  createTest,
  fetchQuestions,
  fetchTests,
} from "../api/tests";
import type { Question } from "../api/tests";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  onQuestionSelect: (question: Question | null) => void;
};

export default function TestBuilder({ onQuestionSelect }: Props) {
  const queryClient = useQueryClient();
  const { data: tests } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchTests,
  });

  const [selectedTest, setSelectedTest] = useState<number>();

  const { data: questions } = useQuery({
    queryKey: ["questions", selectedTest],
    queryFn: () => (selectedTest ? fetchQuestions(selectedTest) : Promise.resolve([])),
    enabled: Boolean(selectedTest),
  });

  const [testForm, setTestForm] = useState({ name: "", description: "" });
  const [questionForm, setQuestionForm] = useState({
    prompt: "",
    model_answer_text: "",
    model_answer_image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentTestName = useMemo(
    () => tests?.find((test) => test.id === selectedTest)?.name ?? "",
    [tests, selectedTest],
  );

  const handleTestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createTest(testForm);
      await queryClient.invalidateQueries({ queryKey: ["tests"] });
      setTestForm({ name: "", description: "" });
      setMessage("Test created!");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTest) return;
    setLoading(true);
    try {
      await createQuestion(selectedTest, {
        prompt: questionForm.prompt,
        model_answer_text: questionForm.model_answer_text || undefined,
        model_answer_image: questionForm.model_answer_image ?? undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ["questions", selectedTest] });
      setQuestionForm({ prompt: "", model_answer_text: "", model_answer_image: null });
      setMessage("Question saved and OCR processed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <header>
        <p className="eyebrow">Phase 1 · Setup</p>
        <h2>Create tests & model answers</h2>
      </header>
      <div className="panel-grid">
        <form onSubmit={handleTestSubmit}>
          <h3>New Test</h3>
          <label>
            Name
            <input
              value={testForm.name}
              onChange={(e) => setTestForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={testForm.description}
              onChange={(e) =>
                setTestForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={2}
            />
          </label>
          <button disabled={loading} type="submit">
            Save test
          </button>
        </form>
        <div>
          <h3>Your Tests</h3>
          <div className="test-list">
            {tests?.map((test) => (
              <button
                key={test.id}
                className={selectedTest === test.id ? "active" : ""}
                onClick={() => {
                  setSelectedTest(test.id);
                  onQuestionSelect(null);
                }}
              >
                <span>{test.name}</span>
                <small>{new Date(test.created_at).toLocaleDateString()}</small>
              </button>
            ))}
            {!tests?.length && <p>No tests yet</p>}
          </div>
        </div>
      </div>
      {selectedTest && (
        <>
          <form className="question-form" onSubmit={handleQuestionSubmit}>
            <h3>Add model answer to {currentTestName}</h3>
            <label>
              Prompt
              <textarea
                value={questionForm.prompt}
                onChange={(e) =>
                  setQuestionForm((prev) => ({ ...prev, prompt: e.target.value }))
                }
                required
                rows={3}
              />
            </label>
            <label>
              Answer text
              <textarea
                value={questionForm.model_answer_text}
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    model_answer_text: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Paste or type the model answer..."
              />
            </label>
            <label className="file">
              or upload image
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    model_answer_image: e.target.files?.[0] ?? null,
                  }))
                }
              />
            </label>
            <button disabled={loading} type="submit">
              Save question
            </button>
          </form>
          <div className="question-list">
            <h3>Questions ({questions?.length ?? 0})</h3>
            {questions?.map((question) => (
              <article
                key={question.id}
                onClick={() => onQuestionSelect(question)}
                className="question-card"
              >
                <p className="prompt">{question.prompt}</p>
                <p className="answer">{question.model_answer_text}</p>
              </article>
            ))}
          </div>
        </>
      )}
      {message && <p className="status">{message}</p>}
    </section>
  );
}

