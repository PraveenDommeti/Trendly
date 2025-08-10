import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  Crown, 
  Star, 
  TrendingUp, 
  Gift, 
  Users, 
  Calendar,
  Award,
  Zap,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  Target,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { useTST } from '@/context/TSTContext';
import TSTErrorBoundary from '@/components/TSTErrorBoundary';

const TrendlyTokensPageContent = () => {
  const { 
    tstBalance, 
    dailyStreak, 
    leaderboardRank, 
    nftProgress, 
    nftRequired, 
    recentEarnings,
    earnTST,
    spendTST,
    getStreakBonus,
    getNFTProgress
  } = useTST();

  // Add some debugging to see if context is working
  console.log('TST Context Data:', {
    tstBalance,
    dailyStreak,
    leaderboardRank,
    nftProgress,
    nftRequired,
    recentEarnings: recentEarnings?.length || 0
  });

  // Loading state while context initializes
  if (tstBalance === undefined || dailyStreak === undefined) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TST rewards...</p>
        </div>
      </div>
    );
  }

  const leaderboardData = [
    { rank: 1, username: 'Fashionista_Pro', tst: 12500, avatar: '👑' },
    { rank: 2, username: 'StyleQueen', tst: 9800, avatar: '👸' },
    { rank: 3, username: 'TrendSetter', tst: 8700, avatar: '⭐' },
    { rank: 4, username: 'FashionForward', tst: 7200, avatar: '💎' },
    { rank: 5, username: 'StyleGuru', tst: 6500, avatar: '🎯' },
    { rank: 23, username: 'You', tst: 2450, avatar: '👤', isCurrentUser: true },
  ];

  const availableRewards = [
    { id: 1, name: 'Exclusive Discount', cost: 500, type: 'discount', value: '20% off next purchase', icon: '🎁' },
    { id: 2, name: 'Early Access', cost: 1000, type: 'access', value: 'Limited edition collection', icon: '🔑' },
    { id: 3, name: 'Creator Tip', cost: 200, type: 'tip', value: 'Support your favorite creator', icon: '💝' },
    { id: 4, name: 'VIP Event Access', cost: 2000, type: 'event', value: 'Virtual fashion show', icon: '🎭' },
  ];

  const nftRewards = [
    { id: 1, name: 'Trendsetter NFT', required: 5000, progress: 2450, status: 'in-progress', rarity: 'Rare' },
    { id: 2, name: 'Fashion Icon NFT', required: 10000, progress: 2450, status: 'locked', rarity: 'Epic' },
    { id: 3, name: 'Style Legend NFT', required: 25000, progress: 2450, status: 'locked', rarity: 'Legendary' },
  ];

  const dailyTasks = [
    { id: 1, name: 'Post a fashion photo', reward: 50, completed: true },
    { id: 2, name: 'Like 5 posts', reward: 25, completed: true },
    { id: 3, name: 'Share a product', reward: 75, completed: false },
    { id: 4, name: 'Complete a challenge', reward: 100, completed: false },
  ];

  const handleRedeemReward = (reward: any) => {
    if (tstBalance >= reward.cost) {
      spendTST(reward.cost, reward.name);
      // Show success message
    }
  };

  const nftProgressPercentage = getNFTProgress();

  // Fallback values in case context is not loaded
  const safeTstBalance = tstBalance || 2450;
  const safeDailyStreak = dailyStreak || 7;
  const safeLeaderboardRank = leaderboardRank || 23;
  const safeNftProgress = nftProgress || 2450;
  const safeNftRequired = nftRequired || 5000;
  const safeRecentEarnings = recentEarnings || [];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-600">Trendly Rewards</h1>
          <p className="text-gray-600 dark:text-gray-400">Earn, spend, and unlock exclusive benefits</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
          <Coins className="w-4 h-4 text-purple-600" />
          <span className="font-bold text-purple-600">{safeTstBalance.toLocaleString()} TST</span>
        </div>
      </div>

      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              <span className="text-2xl">🔗</span>
              <span className="text-2xl">👑</span>
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Welcome to Trendly Rewards</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Earn Trendly Style Tokens (TST) for every interaction, unlock exclusive NFTs, 
            and gain access to premium features, events, and creator collaborations.
          </p>
          <div className="flex justify-center mt-4 gap-2">
            <Button 
              onClick={() => earnTST(50, 'Test reward')}
              size="sm"
              variant="outline"
              className="bg-purple-100 hover:bg-purple-200"
            >
              <Star className="w-4 h-4 mr-2" />
              Test: Earn 50 TST
            </Button>
            <Button 
              onClick={() => {
                localStorage.removeItem('trendly-tst-data');
                window.location.reload();
              }}
              size="sm"
              variant="outline"
              className="bg-red-100 hover:bg-red-200 text-red-700"
            >
              Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Coins className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total TST Balance</p>
              <p className="text-xl font-bold text-purple-600">{safeTstBalance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily Streak</p>
              <p className="text-xl font-bold text-orange-600">{safeDailyStreak} days</p>
              <p className="text-xs text-green-600">+50 TST daily</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Leaderboard Rank</p>
              <p className="text-xl font-bold text-green-600">#{safeLeaderboardRank}</p>
              <p className="text-xs text-gray-500">Top 5% this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NFT Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Progress to Trendsetter NFT
            <Badge variant="secondary" className="ml-auto">
              <Crown className="w-3 h-3 mr-1" />
              Exclusive
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Current TST: {safeNftProgress.toLocaleString()}</span>
              <span>Required: {safeNftRequired.toLocaleString()}</span>
            </div>
            <Progress value={nftProgressPercentage} className="h-3" />
            <p className="text-xs text-gray-500">
              {safeNftRequired - safeNftProgress} more TST needed to unlock your exclusive NFT
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="tasks">Daily Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Available Rewards
              </CardTitle>
              <CardDescription>
                Redeem your TST for exclusive perks and benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-sm text-gray-500">{reward.value}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{reward.cost} TST</p>
                      <Button 
                        size="sm"
                        onClick={() => handleRedeemReward(reward)}
                        disabled={safeTstBalance < reward.cost}
                        className="mt-1"
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Top Trendsetters
              </CardTitle>
              <CardDescription>
                This month's leaderboard - climb the ranks to earn more TST
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((user, index) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.isCurrentUser 
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700' 
                        : 'border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{user.avatar}</span>
                        <div className="text-center">
                          <p className="font-bold text-sm">#{user.rank}</p>
                          {user.rank <= 3 && (
                            <div className="flex justify-center">
                              {user.rank === 1 && <Crown className="w-3 h-3 text-yellow-500" />}
                              {user.rank === 2 && <Crown className="w-3 h-3 text-gray-400" />}
                              {user.rank === 3 && <Crown className="w-3 h-3 text-orange-500" />}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.tst.toLocaleString()} TST</p>
                      </div>
                    </div>
                    {user.isCurrentUser && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        You
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recent Earnings
              </CardTitle>
              <CardDescription>
                Your recent TST earnings and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {safeRecentEarnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        earning.amount > 0 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {earning.amount > 0 ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <span className="text-xs">-</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{earning.reason}</p>
                        <p className="text-sm text-gray-500">
                          {earning.timestamp.toLocaleDateString()} at {earning.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${earning.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {earning.amount > 0 ? '+' : ''}{earning.amount} TST
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* NFT Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            NFT Rewards Gallery
          </CardTitle>
          <CardDescription>
            Unlock exclusive NFTs by earning TST
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nftRewards.map((nft) => (
              <div key={nft.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    nft.status === 'locked' 
                      ? 'bg-gray-200 dark:bg-gray-700' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {nft.status === 'locked' ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Crown className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{nft.name}</p>
                    <p className="text-sm text-gray-500">{nft.rarity} • {nft.required.toLocaleString()} TST required</p>
                  </div>
                </div>
                <div className="text-right">
                  <Progress 
                    value={(nft.progress / nft.required) * 100} 
                    className="w-20 h-2 mb-2" 
                  />
                  <p className="text-xs text-gray-500">
                    {nft.progress.toLocaleString()}/{nft.required.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TrendlyTokensPage = () => {
  return (
    <TSTErrorBoundary>
      <TrendlyTokensPageContent />
    </TSTErrorBoundary>
  );
};

export default TrendlyTokensPage;
