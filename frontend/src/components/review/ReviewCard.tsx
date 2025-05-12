import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface ReviewCardProps {
  id: number;
  username: string;
  user_id?: string;
  rating: number;
  date: string;
  content: string;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  username,
  rating,
  date,
  content,
  className = "",
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
              {username.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="font-medium">{username}</p>
              <p className="text-sm text-gray-500">{date}</p>
            </div>
          </div>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="ml-1 text-sm font-medium text-yellow-700">
              {rating}
            </span>
          </div>
        </div>
        <p className="mt-4 text-gray-700 whitespace-pre-line">{content}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
