
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenges, ChallengeSubmission } from "../context/ChallengesContext";
import { useSupabaseTrendly } from "../context/SupabaseTrendlyContext";
import { motion } from "framer-motion";
import { Calendar, Clock, Upload, Award, Users, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import ChallengeSubmissionForm from "../components/ChallengeSubmissionForm";

const ChallengesPage = () => {
  const navigate = useNavigate();
  const { challenges, currentChallenge, submissions, userSubmissions } = useChallenges();
  const { posts } = useSupabaseTrendly();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(currentChallenge);
  const [activeTab, setActiveTab] = useState("active");

  // Generate leaderboard from posts based on total_points
  const leaderboard = posts
    .map(post => post.profiles)
    .filter((profile, index, self) => self.findIndex(p => p.id === profile.id) === index)
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 10);

  // Filter submissions based on selected challenge
  const filteredSubmissions = submissions.filter(
    (submission) => submission.challengeId === (selectedChallenge?.id || currentChallenge?.id)
  );

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Function to calculate days left
  const calculateDaysLeft = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderSubmission = (submission: ChallengeSubmission) => (
    <motion.div
      key={submission.id}
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="p-3">
          <div className="flex items-center">
            <img
              src={submission.user.avatar}
              alt={submission.user.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="ml-2">
              <p className="text-sm font-medium">{submission.user.name}</p>
              <p className="text-xs text-gray-500">{formatDate(submission.createdAt)}</p>
            </div>
          </div>
        </CardHeader>
        <div className="px-3">
          <img
            src={submission.image}
            alt="Challenge submission"
            className="w-full aspect-square object-cover rounded-md"
          />
        </div>
        <CardContent className="p-3">
          <p className="text-sm mb-1">
            <span className="font-medium mr-1">{submission.user.username}</span>
            {submission.caption}
          </p>
          <p className="text-xs text-gray-500">{submission.likes} likes</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <h1 className="text-2xl font-bold text-trendly-primary mb-2">Style Challenges</h1>
        <p className="text-sm text-muted-foreground">
          Participate in weekly challenges and showcase your creativity
        </p>
      </div>

      <Tabs defaultValue="active" className="p-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="yours">Your Entries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-0">
          {currentChallenge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <div className="relative">
                  <img
                    src={currentChallenge.image}
                    alt={currentChallenge.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 bg-trendly-primary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Clock size={14} className="mr-1" />
                    {calculateDaysLeft(currentChallenge.endDate)} days left
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{currentChallenge.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users size={16} className="mr-1" />
                    <span>{currentChallenge.participants} participants</span>
                    <span className="mx-2">•</span>
                    <Calendar size={16} className="mr-1" />
                    <span>Ends {formatDate(currentChallenge.endDate)}</span>
                  </div>
                  <CardDescription className="mt-2">{currentChallenge.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-trendly-primary hover:bg-trendly-dark">
                        <Upload size={16} className="mr-2" />
                        Submit Your Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Your Entry</DialogTitle>
                        <DialogDescription>
                          Share your style for the "{currentChallenge.title}" challenge
                        </DialogDescription>
                      </DialogHeader>
                      <ChallengeSubmissionForm 
                        challengeId={currentChallenge.id} 
                        onClose={() => setOpenDialog(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>

              <div className="mb-4">
                <h2 className="text-lg font-medium mb-3">Recent Submissions</h2>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map(renderSubmission)
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No submissions yet. Be the first to submit!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Trendly Points Leaderboard
                    </CardTitle>
                    <CardDescription>Top fashion influencers ranked by total points earned</CardDescription>
                  </div>
                  <Button 
                    onClick={() => navigate('/leaderboard')}
                    variant="outline"
                    size="sm"
                  >
                    View Full Rankings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      className="flex items-center p-3 rounded-lg border bg-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-trendly-primary to-purple-600 text-white text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <img
                        src={profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop'}
                        alt={profile.full_name || profile.username}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{profile.full_name || profile.username}</h3>
                        <p className="text-xs text-muted-foreground">@{profile.username}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-trendly-primary font-bold">
                          <Zap className="w-4 h-4 mr-1" />
                          {profile.total_points.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                      {index < 3 && (
                        <div className="ml-2">
                          {index === 0 && <div className="w-6 h-6 text-yellow-500">🥇</div>}
                          {index === 1 && <div className="w-6 h-6 text-gray-400">🥈</div>}
                          {index === 2 && <div className="w-6 h-6 text-amber-600">🥉</div>}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-trendly-primary" />
                  How to Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 rounded-lg bg-muted/50">
                    <Upload className="w-5 h-5 mr-3 text-green-500" />
                    <div>
                      <h4 className="font-medium">Submit Challenge Entry</h4>
                      <p className="text-sm text-muted-foreground">+100 points for each challenge submission</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-muted/50">
                    <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
                    <div>
                      <h4 className="font-medium">Win Weekly Challenge</h4>
                      <p className="text-sm text-muted-foreground">+500 points for winning a challenge</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-muted/50">
                    <Users className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Build Your Following</h4>
                      <p className="text-sm text-muted-foreground">+10 points per new follower</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-0">
          <div className="grid gap-4">
            {challenges
              .filter(challenge => !challenge.isActive)
              .map(challenge => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <div className="relative">
                      <img
                        src={challenge.image}
                        alt={challenge.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar size={14} className="mr-1" />
                        <span>Starts {formatDate(challenge.createdAt)}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            {challenges.filter(challenge => !challenge.isActive).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No upcoming challenges at the moment.
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="yours" className="mt-0">
          {userSubmissions.length > 0 ? (
            userSubmissions.map(renderSubmission)
          ) : (
            <div className="text-center py-12">
              <Award size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Submissions Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't participated in any challenges yet.
              </p>
              <Button 
                onClick={() => {
                  setActiveTab("active");
                  toast({
                    title: "Challenge time!",
                    description: "Let's participate in this week's challenge",
                  });
                }}
                className="bg-trendly-primary hover:bg-trendly-dark"
              >
                Explore Active Challenges
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengesPage;
