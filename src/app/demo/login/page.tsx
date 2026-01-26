"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  User,
  Lock,
  Mail,
  ArrowRight,
  Building2,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";

// Demo credentials
const DEMO_ACCOUNTS = {
  tenant: {
    email: "marcus@demo.com",
    password: "demo123",
    name: "Marcus Johnson",
    role: "Tenant",
    redirect: "/demo/portal",
  },
  admin: {
    email: "admin@demo.com",
    password: "admin123",
    name: "Sarah Admin",
    role: "Property Manager",
    redirect: "/demo/admin",
  },
  howard: {
    email: "howard@chatmaninc.com",
    password: "Howard1234",
    name: "Howard Chatman",
    role: "Admin",
    redirect: "/demo/admin",
  },
  ecko: {
    email: "ecko@chatmaninc.com",
    password: "Ecko1234",
    name: "Ecko",
    role: "Admin",
    redirect: "/demo/admin",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check credentials against all accounts
    const matchedAccount = Object.values(DEMO_ACCOUNTS).find(
      (account) =>
        email.toLowerCase() === account.email.toLowerCase() &&
        password === account.password
    );

    if (matchedAccount) {
      setLoginSuccess(matchedAccount.name);
      setTimeout(() => {
        router.push(matchedAccount.redirect);
      }, 1500);
    } else {
      setError("Invalid email or password. Try the demo credentials below.");
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: "tenant" | "admin") => {
    setEmail(DEMO_ACCOUNTS[type].email);
    setPassword(DEMO_ACCOUNTS[type].password);
    setError("");
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
          <p className="text-gray-400">
            Signing in as <span className="text-white">{loginSuccess}</span>...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-700/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80')",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Chatman RP</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Your Property
              <br />
              <span className="text-amber-400">Management Portal</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-md">
              Access your tenant dashboard, pay rent, submit maintenance
              requests, and manage your documents all in one place.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Lock className="w-5 h-5 text-amber-400" />
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            &copy; 2025 Chatman RP. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Chatman RP</span>
            </Link>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Sign in to your account
              </h2>
              <p className="text-gray-400">
                Access your tenant or admin portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 bg-gray-900/50 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <span className="text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400 mb-4">
                Demo Accounts (click to fill)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("tenant")}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-900/50 border border-gray-600 rounded-lg hover:border-amber-500/50 hover:bg-gray-900 transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">Tenant</p>
                    <p className="text-gray-500 text-xs">marcus@demo.com</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoCredentials("admin")}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-900/50 border border-gray-600 rounded-lg hover:border-amber-500/50 hover:bg-gray-900 transition-all group"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Home className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">Admin</p>
                    <p className="text-gray-500 text-xs">admin@demo.com</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/#contact"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
