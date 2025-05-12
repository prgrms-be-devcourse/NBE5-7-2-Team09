// src/components/book/BookCover.tsx
import React from "react";
import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookCoverProps {
  book: {
    id: number;
    title: string;
    author: string;
    cover: string;
    category: string;
    rating?: number;
    publishDate?: string;
    isNew?: boolean;
    isBestseller?: boolean;
  };
  isNewRelease?: boolean;
  onClick?: (id: number) => void;
  className?: string;
}

const BookCover: React.FC<BookCoverProps> = ({
  book,
  isNewRelease = false,
  onClick,
  className = "",
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(book.id);
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-40 md:w-64 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-96 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-book.png"; // 이미지 로드 실패 시 대체 이미지
            }}
          />
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm line-clamp-1">{book.title}</h3>
            {isNewRelease && book.isNew && (
              <Badge className="ml-1 bg-green-500 text-xs">신간</Badge>
            )}
            {!isNewRelease && book.isBestseller && (
              <Badge className="ml-1 bg-red-500 text-xs">베스트셀러</Badge>
            )}
          </div>
          <p className="text-gray-600 text-xs">{book.author}</p>
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {book.category}
            </Badge>
            {isNewRelease ? (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{book.publishDate?.slice(5)}</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-yellow-500">
                <Star className="h-3 w-3 fill-yellow-500" />
                <span>{book.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
