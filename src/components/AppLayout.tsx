import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, TrendingUp, UtensilsCrossed, User, Settings, Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDashboard } from "@/hooks/useDashboard";

/* Full sidebar nav items (desktop + tablet) */
const navItems = [
  { title: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
  { title: "Chat & Log", path: "/app/chat", icon: MessageSquare },
  { title: "My Insights", path: "/app/insights", icon: TrendingUp },
  { title: "Food Log", path: "/app/food-log", icon: UtensilsCrossed },
  { title: "Profile", path: "/app/profile", icon: User },
  { title: "Settings", path: "/app/settings", icon: Settings },
];

/* Bottom nav items — 5 tabs for mobile */
const mobileNavItems = [
  { title: "Home", path: "/app/dashboard", icon: LayoutDashboard },
  { title: "Chat", path: "/app/chat", icon: MessageSquare },
  { title: "Log", path: "/app/food-log", icon: UtensilsCrossed },
  { title: "Insights", path: "/app/insights", icon: TrendingUp },
  { title: "Profile", path: "/app/profile", icon: User },
];

const wellnessBreakdown = [
  { label: "Nutrition", score: 31, max: 40, color: "hsl(147, 35%, 49%)" },
  { label: "Consistency", score: 20, max: 25, color: "hsl(214, 56%, 57%)" },
  { label: "Hydration", score: 13, max: 15, color: "hsl(200, 70%, 55%)" },
  { label: "Lifestyle", score: 8, max: 10, color: "hsl(36, 78%, 56%)" },
  { label: "Gut Health", score: 8, max: 10, color: "hsl(340, 60%, 55%)" },
];

const WellnessScoreContent = ({ breakdown, total }: { breakdown: typeof wellnessBreakdown; total: number }) => (
  <div>
    <p className="text-xs font-sans font-semibold text-foreground mb-2">Your Wellness Score</p>
    <p className="text-[11px] text-muted-foreground font-sans mb-3">
      Nutrition (40%) + Consistency (25%) + Hydration (15%) + Lifestyle (10%) + Gut Health (10%)
    </p>
    <div className="space-y-2.5">
      {breakdown.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="w-16 text-[11px] font-sans text-foreground">{item.label}</span>
          <div className="flex-1 h-2 bg-muted rounded-pill overflow-hidden">
            <div className="h-full rounded-pill" style={{ width: `${(item.score / item.max) * 100}%`, background: item.color }} />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground w-10 text-right">{item.score}/{item.max}</span>
        </div>
      ))}
    </div>
    <div className="mt-3 pt-2 border-t border-border">
      <p className="text-[11px] font-mono font-semibold text-foreground">Total: {total}/100</p>
    </div>
  </div>
);

const AppLayout = () => {
  const location = useLocation();
  const { profile } = useUserProfile();
  const { wellnessScore } = useDashboard();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);
  const [wellnessSheetOpen, setWellnessSheetOpen] = useState(false);

  const scoreTarget = wellnessScore?.overall ?? 78;
  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const initial = firstName.charAt(0).toUpperCase();

  // Build wellness breakdown from real data or defaults
  const wBreakdown = [
    { label: "Nutrition", score: wellnessScore?.nutrition?.score ?? 31, max: 40, color: "hsl(147, 35%, 49%)" },
    { label: "Consistency", score: wellnessScore?.consistency?.score ?? 20, max: 25, color: "hsl(214, 56%, 57%)" },
    { label: "Hydration", score: wellnessScore?.hydration?.score ?? 13, max: 15, color: "hsl(200, 70%, 55%)" },
    { label: "Lifestyle", score: wellnessScore?.lifestyle?.score ?? 8, max: 10, color: "hsl(36, 78%, 56%)" },
    { label: "Gut Health", score: wellnessScore?.gutHealth?.score ?? 8, max: 10, color: "hsl(340, 60%, 55%)" },
  ];

  // Animate wellness score on mount or change
  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * scoreTarget));
      setRingProgress(eased * scoreTarget);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [scoreTarget]);

  const isActive = (path: string) =>
    location.pathname === path || (path === "/app/chat" && location.pathname === "/app");

  return (
    <div className="flex min-h-screen w-full bg-background">

      {/* ========== DESKTOP SIDEBAR (>1024px) ========== */}
      <aside className="hidden lg:flex w-60 border-r border-border bg-card flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 pb-2">
          <h1 className="font-serif text-xl font-bold text-primary">NourishMind</h1>
        </div>
        <div className="px-6 pb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">{initial}</div>
          <span className="text-sm font-sans text-foreground">Hi, {firstName} 👋</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all ${
                isActive(item.path)
                  ? "bg-accent/40 text-primary border-l-[3px] border-secondary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
        {/* Wellness Score — desktop popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-6 flex items-center gap-3 hover:bg-muted/50 transition-colors rounded-xl mx-2 mb-2 text-left">
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3"
                    strokeDasharray={`${(ringProgress / 100) * 125.6} 125.6`} strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.05s linear" }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-foreground">{animatedScore}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground font-sans">Wellness</p>
                <p className="text-xs text-muted-foreground font-sans">{animatedScore}/100 Today</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-72 p-4" align="start">
            <WellnessScoreContent breakdown={wBreakdown} total={animatedScore} />
          </PopoverContent>
        </Popover>
      </aside>

      {/* ========== TABLET SIDEBAR (768-1024px) — collapsed icons only ========== */}
      <aside className="hidden md:flex lg:hidden w-16 border-r border-border bg-card flex-col shrink-0 sticky top-0 h-screen items-center py-4 group hover:w-60 transition-all duration-200 overflow-hidden z-50">
        <div className="px-2 pb-4 flex items-center justify-center group-hover:px-6 group-hover:justify-start w-full">
          <h1 className="font-serif text-lg font-bold text-primary hidden group-hover:block">NourishMind</h1>
          <h1 className="font-serif text-lg font-bold text-primary group-hover:hidden">N</h1>
        </div>
        <nav className="flex-1 w-full px-2 group-hover:px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center group-hover:justify-start gap-3 px-2 group-hover:px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all ${
                isActive(item.path)
                  ? "bg-accent/40 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="hidden group-hover:inline whitespace-nowrap">{item.title}</span>
            </NavLink>
          ))}
        </nav>
        {/* Wellness — tablet */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 group-hover:p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors rounded-xl mx-1 mb-1 text-left">
              <div className="relative w-10 h-10 shrink-0">
                <svg viewBox="0 0 48 48" className="w-10 h-10 -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3"
                    strokeDasharray={`${(ringProgress / 100) * 125.6} 125.6`} strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.05s linear" }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-foreground">{animatedScore}</span>
              </div>
              <div className="hidden group-hover:block">
                <p className="text-xs font-semibold text-foreground font-sans">Wellness</p>
                <p className="text-xs text-muted-foreground font-sans">{animatedScore}/100</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-72 p-4" align="end">
            <WellnessScoreContent breakdown={wBreakdown} total={animatedScore} />
          </PopoverContent>
        </Popover>
      </aside>

      {/* ========== MAIN CONTENT AREA ========== */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* ========== MOBILE TOP BAR (<768px) ========== */}
        <header className="md:hidden sticky top-0 z-[99] bg-white/92 backdrop-blur-[12px] border-b flex items-center justify-between px-4 safe-top" style={{ height: 56, borderColor: "#E8E4DC" }}>
          <h1 className="font-serif text-lg font-bold" style={{ color: "#1A3C2E" }}>NourishMind</h1>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            {/* Wellness ring — mobile: tap opens bottom sheet */}
            <Sheet open={wellnessSheetOpen} onOpenChange={setWellnessSheetOpen}>
              <SheetTrigger asChild>
                <button className="relative w-8 h-8">
                  <svg viewBox="0 0 48 48" className="w-8 h-8 -rotate-90">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                    <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3"
                      strokeDasharray={`${(ringProgress / 100) * 125.6} 125.6`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold text-foreground">{animatedScore}</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto p-6">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-pill mx-auto mb-6" />
                <WellnessScoreContent breakdown={wBreakdown} total={animatedScore} />
              </SheetContent>
            </Sheet>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-xs">{initial}</div>
          </div>
        </header>

        {/* Page content with fade transition */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ========== MOBILE BOTTOM NAV (<768px) ========== */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-[100] border-t flex items-center justify-around safe-bottom"
          style={{
            height: 60,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "#E8E4DC",
          }}
        >
          {mobileNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-[60px] relative"
              >
                <item.icon className="h-6 w-6" style={{ color: active ? "#4CAF7C" : "#A5A29C" }} />
                <span className="text-[10px] font-sans mt-0.5" style={{ color: active ? "#4CAF7C" : "#A5A29C" }}>
                  {item.title}
                </span>
                {active && (
                  <div className="absolute bottom-1.5 w-[3px] h-[3px] rounded-full" style={{ background: "#4CAF7C" }} />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
