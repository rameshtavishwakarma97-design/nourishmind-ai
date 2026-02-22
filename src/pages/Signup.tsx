import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuthContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const getPasswordStrength = (pw: string): { label: string; color: string; pct: number } => {
    if (pw.length === 0) return { label: '', color: '', pct: 0 };
    if (pw.length < 6) return { label: 'Weak', color: '#D95F5F', pct: 25 };
    if (pw.length < 8) return { label: 'Fair', color: '#E8A838', pct: 50 };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 10) return { label: 'Strong', color: '#4CAF7C', pct: 100 };
    return { label: 'Good', color: '#4A90D9', pct: 75 };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Name is required';
    if (!email) errs.email = 'Email is required';
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const { error } = await signUpWithEmail(email, password, fullName);
    setSubmitting(false);

    if (error) {
      if (error.message?.includes('already registered')) {
        setErrors({ email: 'This email is already registered' });
      } else {
        setErrors({ email: error.message || 'Signup failed' });
      }
    } else {
      navigate('/onboarding', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: '#FAFAF8' }}>
      <motion.div
        className="w-full max-w-[440px] space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold text-primary">NourishMind</h1>
          <p className="text-xs text-muted-foreground font-sans">AI-powered 360° wellness</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-6 shadow-sm">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-[28px] font-bold text-foreground">Create your account</h2>
            <p className="text-sm font-sans text-muted-foreground">Your 360° wellness journey starts here</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-sans font-medium text-muted-foreground">Full Name</label>
              <Input
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl h-11"
              />
              {errors.fullName && <p className="text-xs font-sans" style={{ color: '#D95F5F' }}>{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-sans font-medium text-muted-foreground">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-11"
              />
              {errors.email && <p className="text-xs font-sans" style={{ color: '#D95F5F' }}>{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-sans font-medium text-muted-foreground">Password</label>
              <Input
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-11"
              />
              {strength.label && (
                <div className="space-y-1">
                  <div className="h-1.5 bg-muted rounded-pill overflow-hidden">
                    <div className="h-full rounded-pill transition-all duration-300" style={{ width: `${strength.pct}%`, background: strength.color }} />
                  </div>
                  <p className="text-xs font-sans" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-xs font-sans" style={{ color: '#D95F5F' }}>{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-sans font-medium text-muted-foreground">Confirm Password</label>
              <Input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl h-11"
              />
              {errors.confirmPassword && <p className="text-xs font-sans" style={{ color: '#D95F5F' }}>{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-pill h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-sans text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            variant="outline"
            onClick={() => signInWithGoogle()}
            className="w-full rounded-pill h-12 text-sm font-medium border-border"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm font-sans text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary font-medium hover:underline">Sign in →</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
