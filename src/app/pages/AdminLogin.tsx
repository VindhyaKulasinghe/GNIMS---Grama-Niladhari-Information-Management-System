import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await adminLogin(email, password);
    if (!success) {
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }
    navigate("/divisions", { replace: true });
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0c29] to-[#302b63] p-4">
      <div className="w-full max-w-md rounded-xl bg-white/10 backdrop-blur-xl shadow-2xl p-8">
        <h1 className="mb-6 text-center text-3xl font-semibold text-white">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-white/20 px-3 py-2 pr-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="rounded bg-red-600/20 px-3 py-1 text-sm text-red-200">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}
