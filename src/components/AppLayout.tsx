import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, TrendingUp, UtensilsCrossed, User, Settings } from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
  { title: "Chat & Log", path: "/app/chat", icon: MessageSquare },
  { title: "My Insights", path: "/app/insights", icon: TrendingUp },
  { title: "Food Log", path: "/app/food-log", icon: UtensilsCrossed },
  { title: "Profile", path: "/app/profile", icon: User },
  { title: "Settings", path: "/app/settings", icon: Settings },
];

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card flex flex-col shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-6 pb-2">
          <h1 className="font-serif text-xl font-bold text-primary">NourishMind</h1>
        </div>

        {/* User greeting */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">R</div>
          <span className="text-sm font-sans text-foreground">Hi, Rameshta 👋</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/app/chat" && location.pathname === "/app");
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all ${
                  isActive
                    ? "bg-accent/40 text-primary border-l-[3px] border-secondary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Wellness Score */}
        <div className="p-6 flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <circle
                cx="24" cy="24" r="20" fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="3"
                strokeDasharray={`${(78 / 100) * 125.6} 125.6`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-foreground">78</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground font-sans">Wellness</p>
            <p className="text-xs text-muted-foreground font-sans">78/100 Today</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
