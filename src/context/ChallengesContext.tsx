
import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "./TrendlyContext";

export interface StyleChallenge {
  id: string;
  title: string;
  description: string;
  imagePrompt: string;
  image: string;
  endDate: string;
  participants: number;
  createdAt: string;
  isActive: boolean;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  createdAt: string;
}

interface ChallengesContextType {
  challenges: StyleChallenge[];
  currentChallenge: StyleChallenge | null;
  submissions: ChallengeSubmission[];
  userSubmissions: ChallengeSubmission[];
  submitToChallenge: (challengeId: string, image: string, caption: string) => void;
  likeSubmission: (submissionId: string) => void;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error("useChallenges must be used within a ChallengesProvider");
  }
  return context;
};

export const ChallengesProvider = ({ children }: { children: ReactNode }) => {
  // Mock challenges data
  const [challenges] = useState<StyleChallenge[]>([
    {
      id: "1",
      title: "Summer Vibes Challenge",
      description: "Share your best summer outfit that keeps you cool while looking stylish. Use bright colors and lightweight materials to capture the summer feeling!",
      imagePrompt: "Summer outfit inspiration",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      endDate: "2025-05-28",
      participants: 24,
      createdAt: "2025-05-16",
      isActive: true,
    },
    {
      id: "2",
      title: "Monochrome Madness",
      description: "Create a striking outfit using only one color in different shades. Show how versatile a single color palette can be!",
      imagePrompt: "Monochrome outfit inspiration",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
      endDate: "2025-06-04",
      participants: 18,
      createdAt: "2025-05-22",
      isActive: true,
    },
    {
      id: "3",
      title: "Vintage Revival",
      description: "Bring back styles from decades past with your own modern twist. Show us how you incorporate vintage pieces into contemporary looks!",
      imagePrompt: "Vintage-inspired outfit",
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
      endDate: "2025-06-11",
      participants: 12,
      createdAt: "2025-05-20",
      isActive: false,
    },
  ]);

  const currentChallenge = challenges.find(challenge => challenge.isActive) || null;

  // Mock submissions data
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([
    {
      id: "1",
      challengeId: "1",
      user: {
        id: "3",
        name: "Noah",
        username: "noah_styles",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=256&auto=format&fit=crop",
        streak: 5,
        points: 7530,
        bio: "Streetwear enthusiast",
        followers: 4300,
        following: 750,
      },
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
      caption: "My take on summer vibes with a minimal approach #SummerVibes",
      likes: 32,
      createdAt: "2025-05-18",
    },
    {
      id: "2",
      challengeId: "1",
      user: {
        id: "2",
        name: "Olivia",
        username: "olivia_trendy",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
        streak: 7,
        points: 8920,
        bio: "Fashion blogger",
        followers: 5600,
        following: 890,
      },
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      caption: "Beach day outfit perfect for those hot summer days! #SummerVibes",
      likes: 47,
      createdAt: "2025-05-19",
    },
  ]);

  // User's own submissions
  const userSubmissions = submissions.filter(
    submission => submission.user.id === "1"
  );

  // Submit to challenge function
  const submitToChallenge = (challengeId: string, image: string, caption: string) => {
    const newSubmission: ChallengeSubmission = {
      id: `${submissions.length + 1}`,
      challengeId,
      user: {
        id: "1",
        name: "Sophia",
        username: "sophia_style",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=256&auto=format&fit=crop",
        streak: 2,
        points: 10,
        bio: "Aspiring fashionista",
        followers: 230,
        following: 185,
      },
      image,
      caption,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    setSubmissions(prev => [newSubmission, ...prev]);
  };

  // Like submission function
  const likeSubmission = (submissionId: string) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === submissionId
          ? { ...submission, likes: submission.likes + 1 }
          : submission
      )
    );
  };

  return (
    <ChallengesContext.Provider
      value={{
        challenges,
        currentChallenge,
        submissions,
        userSubmissions,
        submitToChallenge,
        likeSubmission,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
};
