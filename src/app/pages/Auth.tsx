import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../state/auth";
import { usePresentationStore } from "../state/presentationStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function Auth() {
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  const { presentations } = usePresentationStore();
  const previewCards = useMemo(() => presentations.slice(0, 6), [presentations]);
  const tiledCards = useMemo(() => {
    const base = previewCards.length ? previewCards : presentations.slice(0, 1);
    // Fill the 70% area with a consistent grid (4 cols × 6 rows).
    // This gives every tile a predictable width/height with no overflow.
    const count = 24;
    return Array.from({ length: count }, (_, i) => base[i % base.length]);
  }, [presentations, previewCards]);

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupShowPassword, setSignupShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [navigate, user]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#0a0a0a] text-white">
      {/* Full-viewport auth layout (no scrolling) */}
      <main className="h-full w-full">
        <div className="h-full w-full flex flex-col lg:flex-row">
          {/* 70%: Tiled presentation cards (hover reveals a single card) */}
          <section className="relative hidden lg:block lg:basis-[70%] h-full overflow-hidden bg-gradient-to-b from-white/5 to-black/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.10)_0%,transparent_55%)]" />

            <div className="absolute inset-0">
              <div className="grid grid-cols-4 grid-rows-6 gap-0 w-full h-full">
                {tiledCards.map((p, idx) => (
                  <div
                    key={`${p.id}-${idx}`}
                    className="group relative overflow-hidden border border-white/5 bg-black/20 transition-all duration-500 opacity-0 scale-[0.99] hover:opacity-100 hover:scale-[1.02]"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="absolute inset-0 p-3">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover blur-lg brightness-50 scale-110 opacity-70"
                      />
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-contain opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="text-center px-10">
                <p className="text-sm tracking-[0.5em] text-white/40 mb-4">WELCOME TO</p>
                <h1 className="text-6xl 2xl:text-7xl font-black  text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]">
                  UI-verse
                </h1>
               
              </div>
            </div>
          </section>

          {/* 30%: Login / Signup (end-to-end, no card/box) */}
          <aside className="relative h-full w-full lg:basis-[30%] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.08)_0%,transparent_55%)]" />
            <div className="relative h-full w-full flex items-center justify-center px-6 sm:px-10">
              <div className="w-full max-w-md">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                  <p className="text-white/60 mt-1">Login or create an account to continue.</p>
                </div>

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
                    {error}
                  </div>
                )}

                <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
                  <TabsList className="w-full grid grid-cols-2 bg-white/5 border border-white/10 rounded-full p-1">
                    <TabsTrigger
                      value="login"
                      className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-black data-[state=active]:border-yellow-300/50 border border-transparent"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-black data-[state=active]:border-yellow-300/50 border border-transparent"
                    >
                      Signup
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-6">
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setError(null);
                        const result = login(loginEmail, loginPassword);
                        if (!result.ok) return setError(result.message);
                        navigate("/");
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={loginShowPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-12"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                            onClick={() => setLoginShowPassword((v) => !v)}
                            aria-label={loginShowPassword ? "Hide password" : "Show password"}
                          >
                            {loginShowPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-[0_0_24px_rgba(255,215,0,0.20)] border border-yellow-300/40"
                      >
                        Login
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-6">
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setError(null);
                        const result = signup(fullName, signupEmail, signupPassword);
                        if (!result.ok) return setError(result.message);
                        navigate("/");
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="signup-fullname">Full name</Label>
                        <Input
                          id="signup-fullname"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={signupShowPassword ? "text" : "password"}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Create a password"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-12"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                            onClick={() => setSignupShowPassword((v) => !v)}
                            aria-label={signupShowPassword ? "Hide password" : "Show password"}
                          >
                            {signupShowPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-[0_0_24px_rgba(255,215,0,0.20)] border border-yellow-300/40"
                      >
                        Create account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

