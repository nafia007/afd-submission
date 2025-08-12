import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, Users, BarChart3, Building, DollarSign, Shield } from "lucide-react";
import { toast } from "sonner";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { switchToPolygon } from "@/integrations/contracts/filmNFT";
const Navigation = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  console.log("Navigation - user:", user, "authLoading:", authLoading);
  useEffect(() => {
    const checkAdminRole = async () => {
      if (user && !authLoading) {
        // Check if user is admin by email (nafiakocks76@gmail.com)
        setIsAdmin(user.email === 'nafiakocks76@gmail.com');
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminRole();
  }, [user, authLoading]);
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
        setAccount(window.ethereum.selectedAddress);
      }
    };
    checkWallet();
  }, []);
  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error("Please install MetaMask!");
      return;
    }
    setLoading(true);
    try {
      // First switch to Polygon network
      await switchToPolygon();

      // Then connect wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccount(accounts[0]);
      toast.success("Wallet connected to Polygon network!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet or switch to Polygon network");
    }
    setLoading(false);
  };
  const disconnectWallet = () => {
    setAccount(null);
    toast.success("Wallet disconnected");
  };
  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log("Attempting to sign out...");
      if (account) {
        disconnectWallet();
      }
      const {
        error
      } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setIsAdmin(false);
      localStorage.removeItem('user');
      toast.success("Successfully signed out");
      console.log("Successfully signed out");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  return <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-accent hover:text-primary transition-colors">African Film DAO
   SUBMISSIONS</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/marketplace" className="text-foreground/70 hover:text-accent transition-colors">
                Marketplace
              </Link>
              <Link to="/afd" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" />
                AFD
              </Link>
              <Link to="/donate" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Donate
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                  <Link to="/dashboard" className="text-foreground/70 hover:text-accent transition-colors">
                  Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {user && !authLoading ? <div className="flex items-center gap-4">
                <Link to="/profile">
                  <Button variant="ghost" className="gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-base font-semibold transition" aria-label="Profile">
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline">Profile</span>
                  </Button>
                </Link>
                <Link to="/community">
                  <Button variant="secondary" className="gap-2 px-3 py-2 rounded-md flex items-center hover:bg-accent hover:text-accent-foreground text-base font-semibold transition" aria-label="Community">
                    <Users className="w-5 h-5" />
                    <span className="hidden md:inline">Community</span>
                  </Button>
                </Link>
                {account ? <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base shadow-md" onClick={disconnectWallet} disabled={loading}>
                    {shortenAddress(account)}
                  </Button> : <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base shadow-md" onClick={connectWallet} disabled={loading}>
                    Connect Wallet
                  </Button>}
                <Button variant="outline" onClick={handleLogout} disabled={loading} className="font-semibold text-base gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div> : authLoading ? <div className="flex items-center gap-4">
                <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div> : <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="outline" className="font-semibold text-base">
                    Login
                  </Button>
                </Link>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base shadow-md" onClick={connectWallet} disabled={loading}>
                  Connect Wallet
                </Button>
              </div>}
          </div>
        </div>
      </div>
    </nav>;
};
export default Navigation;