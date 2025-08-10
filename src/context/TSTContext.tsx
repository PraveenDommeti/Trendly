import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TSTContextType {
  tstBalance: number;
  dailyStreak: number;
  leaderboardRank: number;
  nftProgress: number;
  nftRequired: number;
  recentEarnings: Array<{
    id: string;
    amount: number;
    reason: string;
    timestamp: Date;
  }>;
  earnTST: (amount: number, reason: string) => void;
  spendTST: (amount: number, reason: string) => void;
  updateDailyStreak: () => void;
  getStreakBonus: () => number;
  getNFTProgress: () => number;
}

const TSTContext = createContext<TSTContextType | undefined>(undefined);

interface TSTProviderProps {
  children: ReactNode;
}

export const TSTProvider: React.FC<TSTProviderProps> = ({ children }) => {
  const [tstBalance, setTstBalance] = useState(2450);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [leaderboardRank, setLeaderboardRank] = useState(23);
  const [nftProgress, setNftProgress] = useState(2450);
  const [nftRequired, setNftRequired] = useState(5000);
  const [recentEarnings, setRecentEarnings] = useState<Array<{
    id: string;
    amount: number;
    reason: string;
    timestamp: Date;
  }>>([
    {
      id: '1',
      amount: 25,
      reason: 'Daily login',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: '2',
      amount: 50,
      reason: 'Posted fashion photo',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    },
    {
      id: '3',
      amount: 50,
      reason: 'Streak bonus',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    }
  ]);

  // Load TST data from localStorage on mount
  useEffect(() => {
    const savedTSTData = localStorage.getItem('trendly-tst-data');
    if (savedTSTData) {
      try {
        const data = JSON.parse(savedTSTData);
        setTstBalance(data.tstBalance || 2450);
        setDailyStreak(data.dailyStreak || 7);
        setLeaderboardRank(data.leaderboardRank || 23);
        setNftProgress(data.nftProgress || 2450);
        setNftRequired(data.nftRequired || 5000);
        setRecentEarnings(
          (data.recentEarnings || []).map((earning: any) => ({
            ...earning,
            timestamp: new Date(earning.timestamp)
          }))
        );
      } catch (error) {
        console.error('Error loading TST data:', error);
      }
    }
  }, []);

  // Save TST data to localStorage whenever it changes
  useEffect(() => {
    const tstData = {
      tstBalance,
      dailyStreak,
      leaderboardRank,
      nftProgress,
      nftRequired,
      recentEarnings: recentEarnings.map(earning => ({
        ...earning,
        timestamp: earning.timestamp.toISOString()
      }))
    };
    localStorage.setItem('trendly-tst-data', JSON.stringify(tstData));
  }, [tstBalance, dailyStreak, leaderboardRank, nftProgress, nftRequired, recentEarnings]);

  const earnTST = (amount: number, reason: string) => {
    const bonus = getStreakBonus();
    const totalEarned = amount + (amount * bonus / 100);
    
    setTstBalance(prev => prev + totalEarned);
    setNftProgress(prev => prev + totalEarned);
    
    const newEarning = {
      id: Date.now().toString(),
      amount: totalEarned,
      reason,
      timestamp: new Date()
    };
    
    setRecentEarnings(prev => [newEarning, ...prev.slice(0, 9)]); // Keep only last 10 earnings
    
    // Update leaderboard rank (simplified simulation)
    if (totalEarned > 50) {
      setLeaderboardRank(prev => Math.max(1, prev - 1));
    }
  };

  const spendTST = (amount: number, reason: string) => {
    if (tstBalance >= amount) {
      setTstBalance(prev => prev - amount);
      setNftProgress(prev => Math.max(0, prev - amount));
      
      const newEarning = {
        id: Date.now().toString(),
        amount: -amount,
        reason: `Spent: ${reason}`,
        timestamp: new Date()
      };
      
      setRecentEarnings(prev => [newEarning, ...prev.slice(0, 9)]);
    }
  };

  const updateDailyStreak = () => {
    const lastLoginDate = localStorage.getItem('trendly-last-login');
    const today = new Date().toDateString();
    
    if (lastLoginDate !== today) {
      localStorage.setItem('trendly-last-login', today);
      
      if (lastLoginDate === new Date(Date.now() - 1000 * 60 * 60 * 24).toDateString()) {
        // Consecutive day
        setDailyStreak(prev => prev + 1);
        earnTST(25, 'Daily login');
      } else if (lastLoginDate) {
        // Streak broken
        setDailyStreak(1);
        earnTST(10, 'Daily login (new streak)');
      } else {
        // First login
        setDailyStreak(1);
        earnTST(25, 'Daily login');
      }
    }
  };

  const getStreakBonus = () => {
    if (dailyStreak >= 7) return 50;
    if (dailyStreak >= 3) return 25;
    return 10;
  };

  const getNFTProgress = () => {
    return (nftProgress / nftRequired) * 100;
  };

  const value: TSTContextType = {
    tstBalance,
    dailyStreak,
    leaderboardRank,
    nftProgress,
    nftRequired,
    recentEarnings,
    earnTST,
    spendTST,
    updateDailyStreak,
    getStreakBonus,
    getNFTProgress
  };

  return (
    <TSTContext.Provider value={value}>
      {children}
    </TSTContext.Provider>
  );
};

export const useTST = (): TSTContextType => {
  const context = useContext(TSTContext);
  if (context === undefined) {
    throw new Error('useTST must be used within a TSTProvider');
  }
  return context;
};
