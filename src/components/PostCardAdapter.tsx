
import { Post as SupabasePost, Profile, Product } from "@/context/SupabaseTrendlyContext";
import PostCard from "./PostCard";

// Legacy Post interface for the PostCard component
interface LegacyUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  streak: number;
  points: number;
  bio: string;
  followers: number;
  following: number;
}

interface LegacyProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface LegacyPost {
  id: string;
  user: LegacyUser;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  products: LegacyProduct[];
  createdAt: string;
}

const mapSupabaseToLegacyPost = (supabasePost: SupabasePost): LegacyPost => {
  return {
    id: supabasePost.id,
    user: {
      id: supabasePost.profiles.id,
      name: supabasePost.profiles.full_name || supabasePost.profiles.username,
      username: supabasePost.profiles.username,
      avatar: supabasePost.profiles.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
      streak: supabasePost.profiles.streak_count,
      points: supabasePost.profiles.total_points,
      bio: supabasePost.profiles.bio || "",
      followers: supabasePost.profiles.followers_count,
      following: supabasePost.profiles.following_count,
    },
    image: supabasePost.image_url,
    caption: supabasePost.description || "",
    likes: supabasePost.likes_count,
    comments: supabasePost.comments_count,
    products: supabasePost.post_products?.map(pp => ({
      id: pp.products.id,
      name: pp.products.name,
      price: pp.products.price,
      image: pp.products.image_url || "/placeholder.svg",
      category: pp.products.category,
      rating: 4.5, // Default rating since it's not in the database
    })) || [],
    createdAt: new Date(supabasePost.created_at).toLocaleDateString(),
  };
};

interface PostCardAdapterProps {
  post: SupabasePost;
}

const PostCardAdapter = ({ post }: PostCardAdapterProps) => {
  const legacyPost = mapSupabaseToLegacyPost(post);
  return <PostCard post={legacyPost} />;
};

export default PostCardAdapter;
