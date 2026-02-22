import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, loading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email) { setEmailError('Email is required'); return; }
    if (!password) { setPasswordError('Password is required'); return; }

    setSubmitting(true);
    const { error } = await signInWithEmail(email, password);
    setSubmitting(false);

    if (error) {
      if (error.message?.includes('Invalid login')) {
        setPasswordError('Invalid email or password');
      } else {
        setPasswordError(error.message || 'Sign in failed');
      }
    } else {
      navigate('/app/chat', { replace: true });
    }
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FAFAF8' }}>
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
            <h2 className="font-serif text-[28px] font-bold text-foreground">Welcome back</h2>
            <p className="text-sm font-sans text-muted-foreground">Sign in to continue your wellness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-sans font-medium text-muted-foreground">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-11"
              />
              {emailError && <p className="text-xs font-sans" style={{ color: '#D95F5F' }}>{emailError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-sans font-medium text-muted-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-11"
              />
              {passwordError && <p className="text-xs font-sans" style={{ color: '#D95F5F' }}>{passwordError}</p>}
            </div>

            <Button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-pill h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>

            <div className="text-center">
              <Link to="/forgot-password" className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-sans text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <Button
            variant="outline"
            onClick={handleGoogle}
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

        {/* Bottom link */}
        <p className="text-center text-sm font-sans text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-secondary font-medium hover:underline">Sign up →</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
