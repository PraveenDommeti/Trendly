
import { useState } from "react";
import { useSupabaseTrendly } from "../context/SupabaseTrendlyContext";
import { useAuth } from "@/hooks/useAuth";
import ProfileHeader from "../components/ProfileHeader";
import EditProfileForm from "../components/EditProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, Heart, ShoppingBag, Trophy, Flame, LogOut, Edit, Camera, User, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { currentUser, posts } = useSupabaseTrendly();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditForm, setShowEditForm] = useState(false);

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
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleQuickPhotoUpdate = () => {
    const url = prompt("Enter new profile picture URL:");
    if (url) {
      // This would be handled by the EditProfileForm component
      setShowEditForm(true);
      toast({
        title: "Photo Update",
        description: "Use the edit form to update your profile picture.",
      });
    }
  };

  const userPosts = posts.filter(post => post.user_id === currentUser?.id);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-trendly-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-xl font-bold">{currentUser.username}</h1>
        <div className="flex items-center space-x-2">
          <motion.div 
            className="flex items-center bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(249, 115, 22, 0.4)",
                "0 0 0 10px rgba(249, 115, 22, 0)",
              ]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Flame size={16} className="mr-1" />
            <span className="font-bold">{currentUser.streak_count} day streak!</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center"
            >
              <LogOut size={16} className="mr-1" />
              Sign Out
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Profile Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="relative">
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
              >
                <Avatar className="w-20 h-20 border-2 border-trendly-primary">
                  <AvatarImage src={currentUser.avatar_url || ''} alt={currentUser.username} />
                  <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.button
                className="absolute -bottom-1 -right-1 bg-trendly-primary text-white rounded-full p-2 shadow-lg"
                onClick={handleQuickPhotoUpdate}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera size={14} />
              </motion.button>
            </div>
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
                {currentUser.full_name || currentUser.username}
              </motion.h2>
              <motion.p 
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                @{currentUser.username}
              </motion.p>
              {currentUser.bio && (
                <motion.p 
                  className="text-sm text-gray-600 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentUser.bio}
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between mt-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
          >
            <p className="font-bold">{currentUser.followers_count}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1 }}
          >
            <p className="font-bold">{currentUser.following_count}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy size={16} className="text-yellow-500 mr-1" />
              </motion.div>
              <p className="font-bold">{currentUser.total_points}</p>
            </div>
            <p className="text-gray-500 text-sm">Points</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.1 }}
          >
            <p className="font-bold text-orange-500">{currentUser.streak_count}</p>
            <p className="text-gray-500 text-sm">Day Streak</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Edit Profile Button */}
      <motion.div 
        className="px-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button 
              className="w-full bg-trendly-primary hover:bg-trendly-dark flex items-center justify-center"
              onClick={() => setShowEditForm(true)}
            >
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline"
              size="default"
              className="flex items-center"
            >
              <Settings size={16} />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Streak Progress Card */}
      <motion.div 
        className="mt-4 p-3 mx-4 bg-gradient-to-r from-amber-50 to-yellow-100 rounded-lg border border-amber-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center">
          <motion.div 
            className="mr-4 bg-amber-500 rounded-full p-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy size={24} className="text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold">Keep your streak going!</h3>
            <p className="text-sm text-gray-700">You're on a {currentUser.streak_count} day posting streak.</p>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-amber-500 h-2.5 rounded-full" 
            style={{ width: `${Math.min((currentUser.streak_count / 7) * 100, 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((currentUser.streak_count / 7) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-right mt-1 text-gray-500">
          {Math.max(0, 7 - currentUser.streak_count)} days until next reward
        </p>
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="posts" className="mt-4">
          <TabsList className="w-full grid grid-cols-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <TabsTrigger value="posts" onClick={() => setActiveTab("posts")} className="w-full">
                <Grid size={18} />
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <TabsTrigger value="saved" onClick={() => setActiveTab("saved")} className="w-full">
                <Heart size={18} />
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <TabsTrigger value="purchases" onClick={() => setActiveTab("purchases")} className="w-full">
                <ShoppingBag size={18} />
              </TabsTrigger>
            </motion.div>
          </TabsList>
          
          <TabsContent value="posts" className="p-1">
            <motion.div 
              className="grid grid-cols-3 gap-1"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {userPosts.map((post, index) => (
                  <motion.div 
                    key={post.id} 
                    className="aspect-square"
                    variants={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={post.image_url} 
                      alt="Post" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="saved">
            <motion.div 
              className="flex flex-col items-center justify-center h-40 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={48} className="text-gray-300 mb-2" />
              </motion.div>
              <p className="text-gray-500">No saved posts yet</p>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="purchases">
            <motion.div 
              className="flex flex-col items-center justify-center h-40 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShoppingBag size={48} className="text-gray-300 mb-2" />
              </motion.div>
              <p className="text-gray-500">No purchases yet</p>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <AnimatePresence>
        {showEditForm && (
          <EditProfileForm onClose={() => setShowEditForm(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;
