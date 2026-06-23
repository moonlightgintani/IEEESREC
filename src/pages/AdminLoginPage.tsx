import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Lock, User, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const LOCAL_ADMIN_KEY = "MRBB2026";

  // =========================
  // SESSION CHECK
  // =========================
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const localAdmin = sessionStorage.getItem("admin_auth");

      if (session || localAdmin === "true") {
        navigate("/admin");
      }
    };

    checkSession();
  }, [navigate]);

  // =========================
  // AUTH HANDLER
  // =========================
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // =========================
      // REGISTER
      // =========================
      if (isRegistering) {
        if (adminKey !== LOCAL_ADMIN_KEY) {
          toast.error("Invalid Admin Passkey. Registration blocked.");
          setLoading(false);
          return;
        }
        // 1. Create Supabase Auth User
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: username.trim(),
          password: password,
        });

        if (signUpError || !data.user) {
          toast.error("Registration failed: " + signUpError?.message);
          setLoading(false);
          return;
        }

        // 2. Insert/update admin profile (NO PASSWORD STORED)
        const { error: insertError } = await supabase.from("admins").upsert([
          {
            id: data.user.id,
            email: username.trim(),
            admin_secret_key_used: adminKey,
            role: "admin",
          },
        ]);

        if (insertError) {
          toast.error("Profile creation failed: " + insertError.message);
          setLoading(false);
          return;
        }

        toast.success("Registration successful! You can now log in.");
        setIsRegistering(false);
      }

      // =========================
      // LOGIN
      // =========================
      else {
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: username.trim(),
            password: password,
          });

        if (loginError) {
          toast.error("Login failed: " + loginError.message);
        } else {
          sessionStorage.setItem("admin_auth", "true");
          toast.success("Logged in successfully");
          navigate("/admin");
        }
      }
    } catch (err) {
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-cyan-400/20 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-[#0b3b8f] transition font-bold z-10 bg-white/80 px-4 py-2 rounded-full"
      >
        <ArrowLeft size={18} />
        Return to Portal
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border overflow-hidden z-10"
      >

        {/* Header */}
        <div className="bg-gradient-to-br from-[#0b3b8f] to-indigo-900 p-10 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white">
            <Lock size={36} />
          </div>

          <h1 className="text-3xl font-black text-white">
            {isRegistering ? "Admin Registration" : "Admin Gateway"}
          </h1>

          <p className="text-blue-100 text-sm mt-2">
            {isRegistering
              ? "Create admin account"
              : "Authorized personnel only"}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-5">

            {/* Username */}
            <div>
              <label className="text-sm font-semibold">Username</label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  className="w-full pl-10 p-3 border rounded-xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 p-3 border rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Admin Key */}
            {isRegistering && (
              <div>
                <label className="text-sm font-semibold text-red-600">
                  Admin Passkey
                </label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-xl mt-2 border-red-300"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0b3b8f] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : isRegistering ? (
                "Create Account"
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-5">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[#0b3b8f] font-semibold"
            >
              {isRegistering
                ? "Already have account? Login"
                : "Need access? Register"}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-400 flex flex-col items-center">
            <ShieldCheck size={16} />
            Secured System
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;