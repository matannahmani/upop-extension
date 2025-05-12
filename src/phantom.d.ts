interface PhantomProvider {
  isPhantom: boolean;
  publicKey: {
    toString(): string;
    toBase58(): string;
    toBytes(): Uint8Array;
  } | null;
  isConnected: boolean;
  autoApprove: boolean;

  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{
    publicKey: {
      toString(): string;
      toBase58(): string;
      toBytes(): Uint8Array;
    };
  }>;
  disconnect: () => Promise<void>;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
  signAndSendTransaction: (
    transaction: any,
    opts?: any
  ) => Promise<{ signature: string }>;
  request: (method: string, params: any) => Promise<unknown>;
  on: (event: string, callback: (args: any) => void) => void;
  off: (event: string, callback: (args: any) => void) => void;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
    phantom?: {
      solana?: PhantomProvider;
    };
    bs58: any;
  }
}

export {};
