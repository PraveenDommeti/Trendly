import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  Zap, 
  TrendingUp, 
  Star, 
  Gift,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface TSTEarningWidgetProps {
  tstBalance: number;
  dailyStreak: number;
  onEarnTST: (amount: number, reason: string) => void;
  showDetailed?: boolean;
}

const TSTEarningWidget = ({ 
  tstBalance, 
  dailyStreak, 
  onEarnTST, 
  showDetailed = false 
}: TSTEarningWidgetProps) => {
  const [showEarningAnimation, setShowEarningAnimation] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [earningReason, setEarningReason] = useState('');

  const quickActions = [
    { id: 1, name: 'Like Post', reward: 5, icon: '👍' },
    { id: 2, name: 'Share Product', reward: 10, icon: '📤' },
    { id: 3, name: 'Follow Creator', reward: 15, icon: '👥' },
    { id: 4, name: 'Complete Challenge', reward: 50, icon: '🎯' },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setEarnedAmount(action.reward);
    setEarningReason(action.name);
    setShowEarningAnimation(true);
    onEarnTST(action.reward, action.name);
    
    setTimeout(() => {
      setShowEarningAnimation(false);
    }, 2000);
  };

  const getStreakBonus = () => {
    if (dailyStreak >= 7) return 50;
    if (dailyStreak >= 3) return 25;
    return 10;
  };

  return (
    <>
      {/* TST Balance Display */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">TST Balance</p>
                <p className="text-lg font-bold text-purple-600">{tstBalance.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <Zap className="w-3 h-3 mr-1" />
                {dailyStreak} day streak
              </Badge>
              <p className="text-xs text-gray-500 mt-1">+{getStreakBonus()}% bonus</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {showDetailed && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <p className="font-medium">Quick Actions</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="h-auto p-3 flex flex-col items-center gap-1"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-xs font-medium">{action.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    +{action.reward} TST
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earning Animation */}
      {showEarningAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <div>
                <p className="font-bold">+{earnedAmount} TST earned!</p>
                <p className="text-sm opacity-90">{earningReason}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Streak Progress */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <p className="font-medium">Daily Streak</p>
            </div>
            <Badge variant="outline">{dailyStreak} days</Badge>
          </div>
          <Progress value={(dailyStreak / 7) * 100} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Current: {dailyStreak} days</span>
            <span>Goal: 7 days</span>
          </div>
          {dailyStreak < 7 && (
            <p className="text-xs text-orange-600 mt-1">
              {7 - dailyStreak} more days to unlock 50% bonus!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Earnings */}
      {showDetailed && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="font-medium">Recent Earnings</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Daily login</span>
                </div>
                <span className="font-medium text-green-600">+25 TST</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Posted fashion photo</span>
                </div>
                <span className="font-medium text-green-600">+50 TST</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Streak bonus</span>
                </div>
                <span className="font-medium text-green-600">+{getStreakBonus()} TST</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NFT Progress Preview */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-500" />
              <p className="font-medium">NFT Progress</p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Star className="w-3 h-3 mr-1" />
              Exclusive
            </Badge>
          </div>
          <Progress value={(tstBalance / 5000) * 100} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{tstBalance.toLocaleString()}/5,000 TST</span>
            <span>{Math.round((tstBalance / 5000) * 100)}%</span>
          </div>
          <p className="text-xs text-purple-600 mt-1">
            {5000 - tstBalance > 0 ? `${(5000 - tstBalance).toLocaleString()} more TST for Trendsetter NFT` : 'NFT unlocked!'}
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default TSTEarningWidget;
