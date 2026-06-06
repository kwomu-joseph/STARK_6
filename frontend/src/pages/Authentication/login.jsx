import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { getRoleRoute } from "../../utils/roleRoutes";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(username, password);
      login({ token: data.token, username, role: data.role, name: data.name });
      navigate(getRoleRoute(data.role));
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-gradient-to-r from-indigo-600 to-violet-900">
      <div className="grid w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-2xl backdrop-blur-2xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-500/30 to-blue-900/40 p-12 lg:flex">
          <div>
            <h1 className="mt-6 text-6xl font-black leading-tight text-white">
              ILES 
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center p-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div>
              <p className="text-cyan-300">Welcome back</p>
              <h2 className="mt-2 text-4xl font-black text-white">Sign in</h2>
            </div>

            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />

            {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-4 font-bold text-white shadow-xl shadow-cyan-500/20 hover:scale-[1.01] disabled:opacity-50">
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="text-center text-slate-400">
              Need an account?{" "}
              <span onClick={() => navigate("/signup")} className="cursor-pointer font-semibold text-cyan-300">
                Create one
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

