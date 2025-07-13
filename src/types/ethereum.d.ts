interface EthereumError {
  code: number;
  message: string;
  reason?: string;
}

interface TransactionParams {
  from: string;
  to: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
}

interface EthereumProvider {
  isMetaMask?: boolean;
  selectedAddress?: string;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (params: unknown) => void) => void;
  removeListener: (event: string, callback: (params: unknown) => void) => void;
}

interface Window {
  ethereum?: EthereumProvider;
}
