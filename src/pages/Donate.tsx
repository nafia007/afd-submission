import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Donate() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('ETH');
  
  const walletAddresses = {
    ETH: '0xE164828e15f29603d98A9994F559e0d41E6317eD',
    MATIC: '0xE164828e15f29603d98A9994F559e0d41E6317eD',
    SOL: 'Hr7HkUi6gEb6j1S8bBR47VpKqciwry1Qx2kAWd417Ne8',
    BTC: '37pjfnVYZcRHcH8jNdUabmK41Mpmsojmnz'
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }
    
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
    setLoading(false);
  };

  const handleDonate = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    try {
      if (network === 'SOL') {
        toast.error('Solana support coming soon');
        return;
      }
      
      if (network === 'BTC') {
        toast.error('Bitcoin donations require manual transfer');
        return;
      }
      
      // First check if wallet is connected to the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const requiredChainId = network === 'ETH' ? '0x1' : '0x89';
      
      if (chainId !== requiredChainId) {
        toast.error(`Please switch to ${network === 'ETH' ? 'Ethereum Mainnet' : 'Polygon Mainnet'} first`);
        return;
      }
      
      // Convert amount to wei (1 ETH = 10^18 wei)
      const valueInWei = Math.floor(Number(amount) * 1e18).toString(16);
      const valueHex = '0x' + valueInWei;
      
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: walletAddresses[network],
          value: valueHex,
          gasLimit: '0x5208',
          gasPrice: '0x3b9aca00'
        }]
      });
      
      toast.success(`Success! Transaction hash: ${txHash}`);
    } catch (error) {
      console.error('Donation failed:', error);
      toast.error(`Donation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto pt-20 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Support Our Project</h1>
        
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {!account ? (
                <Button 
                  className="w-full" 
                  onClick={connectWallet}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Connected with:</p>
                  <p className="font-mono text-sm truncate">{account}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Network</label>
                <Select value={network} onValueChange={setNetwork}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">Ethereum</SelectItem>
                    <SelectItem value="MATIC">Polygon</SelectItem>
                    <SelectItem value="SOL">Solana</SelectItem>
                    <SelectItem value="BTC">Bitcoin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input 
                  type="number" 
                  placeholder="0.1" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Address</label>
                <Input 
                  value={walletAddresses[network]}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleDonate}
                disabled={!account || !amount}
              >
                Donate Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}