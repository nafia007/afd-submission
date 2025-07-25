import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        toast.error("Please enter your email address");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send password reset email";
      console.error("Password reset error:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/40 to-accent/20">
      <div className="w-full max-w-md space-y-8 p-8 bg-card/80 backdrop-blur-xl rounded-xl border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>
        
        {isSubmitted ? (
          <div className="text-center">
            <p className="text-foreground">
              If an account with that email exists, a password reset link has been sent.
            </p>
            <Link to="/login" className="mt-4 inline-block text-accent hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
