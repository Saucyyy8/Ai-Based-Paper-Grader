import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div>
        <p className="eyebrow">OCR + Embeddings</p>
        <h1>AI Papergrader</h1>
        <p>
          Teachers collect gold-standard answers, upload student work, and we score
          everything instantly with Google Vision OCR plus transformer embeddings.
        </p>
      </div>
      <AuthCard />
    </div>
  );
}


