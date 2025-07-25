import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Handle email login/signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      if (isSignUp) {
        // Sign up flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Sign up successful! Please check your email to verify your account.");
        console.log("Sign up successful:", data);
      } else {
        // Sign in flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Successfully signed in!");
        console.log("Sign in successful:", data);
        navigate('/');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      console.error("Authentication error:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google login integration
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Google login failed";
      console.error("Google login error:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/40 to-accent/20">
      <div className="w-full max-w-md space-y-8 p-8 bg-card/80 backdrop-blur-xl rounded-xl border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">
            {isSignUp ? "Join African Film DAO" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp ? "Sign up to submit your film projects" : "Sign in to access your submissions"}
          </p>
        </div>
        
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
            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={loading}
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
          >
            Sign In with Google
          </Button>
        </div>

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
