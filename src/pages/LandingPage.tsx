import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Brain, Utensils, Heart, Smartphone, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "linear-gradient(135deg, #1A3C2E 0%, #2D6B4F 50%, #4CAF7C 100%)" }}>
        <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="lg:w-[60%] space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-medium tracking-[0.25em] uppercase" style={{ color: "#A8D5B5" }}>
              360° Wellness Intelligence
            </p>
            <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-[1.1] text-white">
              Your health, finally understood.
            </h1>
            <p className="text-lg lg:text-xl text-white/80 max-w-lg font-sans">
              Tell the AI what you ate. In plain words. No searching, no measuring, no guessing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/signup")}
                className="bg-white text-primary hover:bg-white/90 rounded-pill px-8 h-12 text-base font-semibold"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 rounded-pill px-8 h-12 text-base bg-transparent"
              >
                Watch how it works
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-[40%]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Glassmorphism chat preview */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-white/70 text-sm font-sans">NourishMind AI</span>
              </div>
              {/* User message */}
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%]" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <p className="text-white text-sm font-sans">I had overnight oats with 7 almonds, 1 scoop Myprotein whey, 250ml Amul Gold milk</p>
                </div>
              </div>
              {/* AI response */}
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%] space-y-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <p className="text-white/90 text-sm font-semibold font-sans">🌅 Breakfast — 697 kcal</p>
                  <div className="grid grid-cols-4 gap-2 text-xs text-white/70 font-mono">
                    <span>P: 44g</span>
                    <span>C: 75g</span>
                    <span>F: 26g</span>
                    <span>94% ✅</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.h2
            className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Logging food shouldn't feel like a part-time job.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {[
              { title: "Manual ingredient searching", desc: "Scrolling through 1,000 entries just to log dal rice." },
              { title: "Western food databases that ignore dal", desc: "Your app doesn't know what poha, upma, or rajma chawal is." },
              { title: "Generic advice for users the app barely knows", desc: "Cookie-cutter tips that ignore your hostel mess reality." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-background rounded-2xl p-8 border border-border text-left shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-sans">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-elevated">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-16 text-center">Everything you need, nothing you don't.</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Large feature card */}
            <motion.div
              className="md:col-span-2 md:row-span-2 rounded-2xl p-10 flex flex-col justify-end min-h-[320px]"
              style={{ background: "linear-gradient(135deg, #1A3C2E, #2D6B4F)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <MessageSquare className="h-10 w-10 text-white/80 mb-4" />
              <h3 className="font-serif text-2xl font-bold text-white mb-2">AI Food Logger</h3>
              <p className="text-white/70 font-sans">Just describe your meal in plain language. Our AI understands Indian food, brands, and portions.</p>
            </motion.div>
            {[
              { icon: Brain, title: "Carbon Copy Profiling", desc: "AI builds a detailed model of your unique lifestyle" },
              { icon: Utensils, title: "Indian Food Intelligence", desc: "IFCT database with 1,000+ Indian foods" },
              { icon: Heart, title: "Menstrual Cycle Tracking", desc: "Nutrition recommendations synced to your cycle" },
              { icon: Moon, title: "Mental Health + Nutrition Link", desc: "Track how food affects your mood and energy" },
              { icon: Smartphone, title: "WhatsApp Bot Integration", desc: "Log meals right from WhatsApp" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <item.icon className="h-6 w-6 text-secondary mb-3" />
                <h3 className="font-serif text-base font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-sans">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #1A3C2E 0%, #2D6B4F 50%, #4CAF7C 100%)" }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-8">Start your 360° health journey.</h2>
          <Button
            onClick={() => navigate("/onboarding")}
            className="bg-white text-primary hover:bg-white/90 rounded-pill px-10 h-12 text-base font-semibold"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
