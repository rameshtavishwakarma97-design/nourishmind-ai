import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { resetPassword } = useAuthContext();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    setError('');
    setSubmitting(true);
    const { error: err } = await resetPassword(email);
    setSubmitting(false);

    if (err) {
      setError(err.message || 'Failed to send reset link');
    } else {
      setSent(true);
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
          {sent ? (
            <motion.div
              className="text-center space-y-4 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h2 className="font-serif text-xl font-bold text-foreground">Check your email</h2>
              <p className="text-sm font-sans text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the link to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 text-sm font-medium text-secondary hover:underline"
              >
                ← Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center space-y-1">
                <h2 className="font-serif text-[28px] font-bold text-foreground">Reset password</h2>
                <p className="text-sm font-sans text-muted-foreground">Enter your email and we'll send a reset link</p>
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
                  {error && <p className="text-xs font-sans" style={{ color: '#D95F5F' }}>{error}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-pill h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                </Button>
              </form>
            </>
          )}
        </div>

        {!sent && (
          <p className="text-center text-sm font-sans text-muted-foreground">
            Remember your password?{' '}
            <Link to="/login" className="text-secondary font-medium hover:underline">Sign in →</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
