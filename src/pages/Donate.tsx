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
    } catch (error: unknown) {
      console.error('Error connecting wallet:', error);
      const errorMessage = (error as EthereumError)?.message || 'Failed to connect wallet';
      toast.error(errorMessage);
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
        setLoading(false);
        return;
      }
      
      if (network === 'BTC') {
        toast.error('Bitcoin donations require manual transfer');
        setLoading(false);
        return;
      }
      
      // First check if wallet is connected to the correct network
      let chainId;
      try {
        chainId = await window.ethereum.request({ method: 'eth_chainId' });
      } catch (chainError: unknown) {
        console.error('Failed to get chain ID:', chainError);
        toast.error('Failed to get network information');
        setLoading(false);
        return;
      }
      
      const requiredChainId = network === 'ETH' ? '0x1' : '0x89';
      
      if (chainId !== requiredChainId) {
        toast.error(`Please switch to ${network === 'ETH' ? 'Ethereum Mainnet' : 'Polygon Mainnet'} first`);
        setLoading(false);
        return;
      }
      
      // Convert amount to wei using BigInt for precision
      let valueHex;
      try {
        const amountStr = amount.toString();
        const [whole, decimal = ''] = amountStr.split('.');
        const paddedDecimal = decimal.padEnd(18, '0').slice(0, 18);
        const valueInWei = BigInt(whole + paddedDecimal);
        valueHex = '0x' + valueInWei.toString(16);
      } catch (conversionError: unknown) {
        console.error('Amount conversion error:', conversionError);
        toast.error('Invalid amount format');
        setLoading(false);
        return;
      }
      
      // Get current gas price
      let gasPrice;
      try {
        gasPrice = await window.ethereum.request({ method: 'eth_gasPrice' });
      } catch (gasPriceError: unknown) {
        console.error('Failed to get gas price:', gasPriceError);
        // Fallback to a reasonable gas price
        gasPrice = '0x3b9aca00'; // 1 gwei
      }
      
      const txParams = {
        from: account,
        to: walletAddresses[network as keyof typeof walletAddresses],
        value: valueHex,
        gasLimit: '0x5208', // 21000 gas for simple transfer
        gasPrice: gasPrice
      };
      
      console.log('Transaction parameters:', txParams);
      
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams]
      });
      
      toast.success(`Success! Transaction hash: ${txHash}`);
      setAmount(''); // Clear the amount after successful transaction
      
    } catch (error: unknown) {
      console.error('Donation failed:', error);
      
      // Handle different types of errors
      let errorMessage = 'Transaction failed';
      
      if (error && typeof error === 'object') {
        const ethError = error as EthereumError;
        if (ethError.code === 4001) {
          errorMessage = 'Transaction rejected by user';
        } else if (ethError.code === -32603) {
          errorMessage = 'Internal JSON-RPC error';
        } else if (ethError.code === -32602) {
          errorMessage = 'Invalid transaction parameters';
        } else if (ethError.code === -32000) {
          errorMessage = 'Insufficient funds for gas';
        } else if (ethError.message) {
          errorMessage = ethError.message;
        } else if (ethError.reason) {
          errorMessage = ethError.reason;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(`Donation failed: ${errorMessage}`);
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
                  step="0.001"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Address</label>
                <Input 
                  value={walletAddresses[network as keyof typeof walletAddresses]}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleDonate}
                disabled={!account || !amount || loading}
              >
                {loading ? 'Processing...' : 'Donate Now'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
