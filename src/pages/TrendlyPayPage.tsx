import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  Zap, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Coins,
  Users,
  BarChart3,
  CreditCard
} from 'lucide-react';

const TrendlyPayPage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('0x742d...b8D4');
  const [hbBalance, setHbBalance] = useState(1250.75);
  const [pendingPayout, setPendingPayout] = useState(2340.5);
  const [creatorEarnings, setCreatorEarnings] = useState(12450.75);
  const [monthlyGrowth, setMonthlyGrowth] = useState(12.5);

  const handleConnectWallet = () => {
    setWalletConnected(true);
    // Simulate wallet connection
    setTimeout(() => {
      setWalletAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b8D4');
    }, 1000);
  };

  const handleInstantPayout = () => {
    // Simulate instant payout
    setPendingPayout(0);
    setHbBalance(prev => prev + pendingPayout);
  };

  const cryptoPaymentMethods = [
    { name: 'HBAR', symbol: 'HBAR', icon: '⚡', balance: 1250.75, rate: 1 },
    { name: 'USDC', symbol: 'USDC', icon: '💎', balance: 500.00, rate: 0.85 },
    { name: 'USDT', symbol: 'USDT', icon: '💎', balance: 300.00, rate: 0.85 },
  ];

  const recentTransactions = [
    { id: 1, type: 'Sale', amount: 450.00, commission: 45.00, status: 'Completed', date: '2 hours ago' },
    { id: 2, type: 'Sale', amount: 320.00, commission: 32.00, status: 'Completed', date: '5 hours ago' },
    { id: 3, type: 'Payout', amount: 2000.00, commission: 0, status: 'Processing', date: '1 day ago' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-600">Trendly Pay</h1>
          <p className="text-gray-600 dark:text-gray-400">Instant Crypto-to-Fashion Commerce</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
          <Zap className="w-3 h-3 mr-1" />
          Powered by Hedera
        </Badge>
      </div>

      {/* Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Hedera Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!walletConnected ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect your Hedera wallet to enable instant crypto payments and automated creator commissions.
              </p>
              <Button onClick={handleConnectWallet} className="w-full bg-purple-600 hover:bg-purple-700">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Connected</span>
                </div>
                <span className="text-xs text-gray-500">{walletAddress}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">HBAR Balance</p>
                  <p className="text-lg font-bold text-purple-600">{hbBalance.toFixed(2)} HBAR</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">USD Value</p>
                  <p className="text-lg font-bold">₹{(hbBalance * 0.85).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instant Crypto Payout */}
      {walletConnected && (
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Instant Crypto Payout Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg font-semibold">
                ₹{pendingPayout.toFixed(2)} ready for instant transfer
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                <span>Blockchain secured</span>
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>Instant transfer</span>
              </div>
              <Button 
                onClick={handleInstantPayout}
                variant="secondary"
                className="w-full bg-white text-purple-600 hover:bg-gray-100"
              >
                <Zap className="w-4 h-4 mr-2" />
                Instant Payout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creator Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Creator Dashboard
          </CardTitle>
          <CardDescription>
            Track your earnings and automated commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-xl font-bold text-green-600">₹{creatorEarnings.toFixed(2)}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                +{monthlyGrowth}% this month
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payout</p>
              <p className="text-xl font-bold text-blue-600">₹{pendingPayout.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Ready for transfer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Supported Payment Methods
          </CardTitle>
          <CardDescription>
            Fast, secure, and cost-efficient crypto payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cryptoPaymentMethods.map((method) => (
              <div key={method.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.balance.toFixed(2)} {method.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{(method.balance * method.rate).toFixed(2)}</p>
                  <p className="text-xs text-green-600">Available</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    tx.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{tx.amount.toFixed(2)}</p>
                  {tx.commission > 0 && (
                    <p className="text-xs text-purple-600">+₹{tx.commission.toFixed(2)} commission</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Highlight */}
      <Card>
        <CardHeader>
          <CardTitle>Why Trendly Pay?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <h4 className="font-medium">Seamless Crypto Payments</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pay with HBAR or stablecoins on Hedera's low-fee, high-speed network
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium">Automated Creator Commissions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instant commission distribution via Hedera Smart Contracts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium">Transparent Transactions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All transactions visible on Hedera's public ledger
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendlyPayPage;
