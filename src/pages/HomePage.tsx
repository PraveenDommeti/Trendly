
import { useSupabaseTrendly } from "../context/SupabaseTrendlyContext";
import PostCardAdapter from "../components/PostCardAdapter";
import SearchBar from "../components/SearchBar";
import TSTEarningWidget from "../components/TSTEarningWidget";
import { useTST } from "../context/TSTContext";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const { posts, loading } = useSupabaseTrendly();
  const { tstBalance, dailyStreak, earnTST } = useTST();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5 
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  if (loading) {
    return (
      <div className="pb-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-trendly-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="sticky top-0 z-10 bg-background border-b p-4 flex flex-col gap-2"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-2xl font-bold text-trendly-primary"
            variants={titleVariants}
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 20px rgba(138, 43, 226, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Trendly
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SearchBar />
        </motion.div>
      </motion.div>

      <motion.div 
        className="px-4 py-2 space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* TST Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TSTEarningWidget 
            tstBalance={tstBalance}
            dailyStreak={dailyStreak}
            onEarnTST={earnTST}
            showDetailed={false}
          />
        </motion.div>

        {posts.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p 
              className="text-gray-500"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              No posts yet. Be the first to share your style!
            </motion.p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div 
                key={post.id} 
                variants={item}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <PostCardAdapter post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
