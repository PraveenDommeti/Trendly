import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Coins,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: (txHash: string) => void;
}

const CryptoPaymentModal = ({ isOpen, onClose, amount, onPaymentComplete }: CryptoPaymentModalProps) => {
  const [paymentStep, setPaymentStep] = useState<'select' | 'confirm' | 'processing' | 'complete'>('select');
  const [selectedMethod, setSelectedMethod] = useState<'hbar' | 'usdc' | 'usdt' | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [txHash, setTxHash] = useState('');

  const paymentMethods = [
    { 
      id: 'hbar', 
      name: 'HBAR', 
      symbol: 'HBAR', 
      icon: '⚡', 
      balance: 1250.75, 
      rate: 0.85,
      description: 'Hedera\'s native cryptocurrency'
    },
    { 
      id: 'usdc', 
      name: 'USDC', 
      symbol: 'USDC', 
      icon: '💎', 
      balance: 500.00, 
      rate: 1,
      description: 'USD Coin on Hedera'
    },
    { 
      id: 'usdt', 
      name: 'USDT', 
      symbol: 'USDT', 
      icon: '💎', 
      balance: 300.00, 
      rate: 1,
      description: 'Tether on Hedera'
    },
  ];

  const handleConnectWallet = () => {
    setWalletConnected(true);
    // Simulate wallet connection
    setTimeout(() => {
      setPaymentStep('select');
    }, 1000);
  };

  const handleSelectMethod = (methodId: 'hbar' | 'usdc' | 'usdt') => {
    setSelectedMethod(methodId);
    setPaymentStep('confirm');
  };

  const handleConfirmPayment = () => {
    setPaymentStep('processing');
    // Simulate payment processing
    setTimeout(() => {
      const mockTxHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setTxHash(mockTxHash);
      setPaymentStep('complete');
      setTimeout(() => {
        onPaymentComplete(mockTxHash);
        onClose();
        setPaymentStep('select');
      }, 2000);
    }, 3000);
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const cryptoAmount = selectedMethodData ? amount / selectedMethodData.rate : 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Crypto Payment
          </DialogTitle>
          <DialogDescription>
            Pay securely with cryptocurrency on Hedera network
          </DialogDescription>
        </DialogHeader>

        {!walletConnected ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Connect Hedera Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Connect your Hedera wallet to enable instant crypto payments and automated creator commissions.
                </p>
                <Button onClick={handleConnectWallet} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {paymentStep === 'select' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Wallet Connected</span>
                  </div>
                  <span className="text-xs text-gray-500">0x742d...b8D4</span>
                </div>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <Card 
                      key={method.id}
                      className="cursor-pointer hover:border-purple-300 transition-colors"
                      onClick={() => handleSelectMethod(method.id as 'hbar' | 'usdc' | 'usdt')}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{method.balance.toFixed(2)} {method.symbol}</p>
                            <p className="text-xs text-green-600">Available</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {paymentStep === 'confirm' && selectedMethodData && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{selectedMethodData.icon}</span>
                      Confirm Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Amount to Pay:</span>
                        <span className="font-medium">{cryptoAmount.toFixed(4)} {selectedMethodData.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Fee:</span>
                        <span className="font-medium">~0.0001 HBAR</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{(cryptoAmount + 0.0001).toFixed(4)} {selectedMethodData.symbol}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4" />
                        <span>Blockchain secured</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>Instant transfer</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setPaymentStep('select')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleConfirmPayment} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Confirm Payment
                  </Button>
                </div>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
                <h3 className="text-lg font-medium">Processing Payment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your transaction is being processed on the Hedera network...
                </p>
                <Progress value={66} className="w-full" />
              </div>
            )}

            {paymentStep === 'complete' && (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-600">Payment Successful!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your transaction has been confirmed on the Hedera network.
                </p>
                
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Transaction Hash:</p>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs font-mono">
                        <span className="truncate">{txHash}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyToClipboard(txHash)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(`https://hashscan.io/transaction/${txHash}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View on HashScan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CryptoPaymentModal;
