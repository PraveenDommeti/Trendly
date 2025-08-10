
import { User } from "../context/TrendlyContext";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10,
              duration: 0.6
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-20 h-20 rounded-full object-cover border-2 border-trendly-primary"
            />
          </motion.div>
          <motion.div 
            className="ml-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h2 
              className="text-xl font-bold"
              whileHover={{ scale: 1.05 }}
            >
              {user.name}
            </motion.h2>
            <motion.p 
              className="text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              @{user.username}
            </motion.p>
          </motion.div>
        </div>
      </div>
      
      <motion.p 
        className="mt-4 text-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {user.bio}
      </motion.p>
      
      <div className="flex justify-between mt-4 text-center">
        <motion.div
          custom={0}
          variants={statsVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.p 
            className="font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {user.followers}
          </motion.p>
          <p className="text-gray-500 text-sm">Followers</p>
        </motion.div>
        
        <motion.div
          custom={1}
          variants={statsVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.p 
            className="font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            {user.following}
          </motion.p>
          <p className="text-gray-500 text-sm">Following</p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center"
          custom={2}
          variants={statsVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy size={16} className="text-yellow-500 mr-1" />
            </motion.div>
            <motion.p 
              className="font-bold"
              animate={{ 
                color: ["#000", "#FFD700", "#000"],
                textShadow: ["0 0 0px #FFD700", "0 0 10px #FFD700", "0 0 0px #FFD700"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {user.points}
            </motion.p>
          </div>
          <p className="text-gray-500 text-sm">Points</p>
        </motion.div>
        
        <motion.div
          custom={3}
          variants={statsVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.p 
            className="font-bold"
            animate={{ 
              color: ["#000", "#FF6B35", "#000"]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            {user.streak}
          </motion.p>
          <p className="text-gray-500 text-sm">Day Streak</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileHeader;
