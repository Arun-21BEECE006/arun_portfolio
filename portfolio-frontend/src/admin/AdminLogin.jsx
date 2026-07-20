import { useState } from "react";
import { RiLockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { api } from "../lib/api";
import { setToken } from "../lib/api";

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      onSuccess();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-ink-600 bg-ink-800/50 p-8"
      >
        <div className="w-12 h-12 rounded-full bg-teal-400/15 border border-teal-400/30 grid place-items-center mb-5">
          <RiLockLine className="text-teal-300" size={20} />
        </div>
        <h1 className="font-display text-2xl font-semibold mb-1">
          Admin Login
        </h1>
        <p className="text-sm text-muted mb-6">
          Manage your portfolio content.
        </p>

        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-ink-900 border border-ink-600 rounded-xl px-3 py-2.5 text-sm mb-4 focus:border-teal-400 outline-none transition-colors"
        />

        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
          Password
        </label>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-ink-900 border border-ink-600 rounded-xl pl-3 pr-10 py-2.5 text-sm focus:border-teal-400 outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-paper transition-colors"
          >
            {showPassword ? (
              <RiEyeOffLine size={16} />
            ) : (
              <RiEyeLine size={16} />
            )}
          </button>
        </div>

        {error && <p className="text-sm text-rose-400 mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 px-5 py-3 rounded-full bg-teal-400 text-ink-900 font-semibold text-sm hover:bg-teal-300 disabled:opacity-60 transition-colors"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <a
          href="/"
          className="block text-center text-xs text-muted mt-5 hover:text-paper"
        >
          ← Back to portfolio
        </a>
      </form>
    </div>
  );
}
