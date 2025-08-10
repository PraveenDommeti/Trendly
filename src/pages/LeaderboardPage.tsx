
import { useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("weekly");

  // Static leaderboard data matching the reference image
  const leaderboardData = {
    weekly: [
      { rank: 1, name: "Olivia", points: 8920 },
      { rank: 2, name: "Noah", points: 7530 },
      { rank: 3, name: "Ethan", points: 7230 },
      { rank: 4, name: "Emma", points: 6890 },
      { rank: 5, name: "Liam", points: 6420 },
      { rank: 6, name: "Sophia", points: 5980 },
      { rank: 7, name: "Mason", points: 5640 },
      { rank: 8, name: "Isabella", points: 5320 },
    ],
    monthly: [
      { rank: 1, name: "Olivia", points: 28920 },
      { rank: 2, name: "Noah", points: 25530 },
      { rank: 3, name: "Ethan", points: 24230 },
      { rank: 4, name: "Emma", points: 22890 },
      { rank: 5, name: "Liam", points: 21420 },
      { rank: 6, name: "Sophia", points: 19980 },
      { rank: 7, name: "Mason", points: 18640 },
      { rank: 8, name: "Isabella", points: 17320 },
    ],
    yearly: [
      { rank: 1, name: "Olivia", points: 128920 },
      { rank: 2, name: "Noah", points: 115530 },
      { rank: 3, name: "Ethan", points: 104230 },
      { rank: 4, name: "Emma", points: 98890 },
      { rank: 5, name: "Liam", points: 91420 },
      { rank: 6, name: "Sophia", points: 87980 },
      { rank: 7, name: "Mason", points: 82640 },
      { rank: 8, name: "Isabella", points: 79320 },
    ],
  };

  const currentData = leaderboardData[period as keyof typeof leaderboardData];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 p-4 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <Trophy className="mr-2 text-yellow-500" size={24} />
        <h1 className="text-xl font-bold text-white">Leaderboard</h1>
      </motion.div>

      {/* Period Tabs */}
      <div className="px-4 py-6">
        <div className="flex bg-gray-800 rounded-lg p-1">
          {["weekly", "monthly", "yearly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                period === tab
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Period Label */}
      <div className="px-4 mb-4">
        <p className="text-center text-sm text-gray-400 uppercase tracking-wider font-medium">
          {period.toUpperCase()}
        </p>
      </div>

      {/* Leaderboard List */}
      <motion.div 
        className="px-4 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {currentData.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
          >
            {/* Rank Circle */}
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-sm">{user.rank}</span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-white font-medium text-lg">{user.name}</h3>
              <p className="text-gray-400 text-sm">
                {user.points.toLocaleString()} Points
              </p>
            </div>

            {/* Top 3 indicators */}
            {user.rank <= 3 && (
              <div className="ml-2">
                {user.rank === 1 && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                )}
                {user.rank === 2 && (
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
                {user.rank === 3 && (
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
