
import { User } from "../context/TrendlyContext";

interface LeaderboardItemProps {
  user: User;
  position: number;
}

const LeaderboardItem = ({ user, position }: LeaderboardItemProps) => {
  return (
    <div className="flex items-center p-4 border-b">
      <div className="w-10 h-10 flex items-center justify-center bg-trendly-primary text-white rounded-full mr-4">
        {position}
      </div>
      <div className="flex items-center flex-1">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-3">
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.points} Points</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
