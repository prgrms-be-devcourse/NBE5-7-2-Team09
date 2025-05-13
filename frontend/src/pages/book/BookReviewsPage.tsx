import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BookCover from "@/components/book/BookCover";
import ReviewCard from "@/components/review/ReviewCard";

// 리뷰 인터페이스 정의
interface Review {
  id: number;
  username: string;
  user_id: string;
  rating: number;
  date: string;
  content: string;
}

// 책 인터페이스 정의
interface Book {
  book_id: string;
  book_name: string;
  author: string;
  book_image: string;
  rating: number;
  reviewCount: number;
  genre_name?: string;
}

const BookReviewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // 상태 관리
  const [book, setBook] = useState<Book | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [reviewContent, setReviewContent] = useState("");
  const [userRating, setUserRating] = useState<number | null>(null);

  // 페이지당 리뷰 수
  const REVIEWS_PER_PAGE = 6;

  // 테스트용 책 데이터
  const mockBook: Book = {
    book_id: id || "",
    book_name: "사피엔스",
    author: "유발 하라리",
    book_image:
      "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788934972464.jpg",
    rating: 4.8,
    reviewCount: 1423,
    genre_name: "인문",
  };

  // 테스트용 리뷰 데이터
  const mockReviews: Review[] = [
    {
      id: 1,
      username: "독서광",
      user_id: "user1",
      rating: 5,
      date: "2025-04-10",
      content:
        "인류의 역사를 이렇게 흥미롭게 풀어낸 책은 처음입니다. 강력 추천합니다!",
    },
    {
      id: 2,
      username: "책벌레",
      user_id: "user2",
      rating: 4,
      date: "2025-04-05",
      content:
        "인류학을 처음 접하는 사람도 쉽게 읽을 수 있습니다. 다만 중반부가 조금 지루했어요.",
    },
    {
      id: 3,
      username: "지식탐험가",
      user_id: "user3",
      rating: 5,
      date: "2025-03-30",
      content:
        "인간이란 무엇인지, 우리는 어디서 왔고 어디로 가는지에 대한 통찰을 얻을 수 있는 책입니다.",
    },
    {
      id: 4,
      username: "도서관지기",
      user_id: "user4",
      rating: 5,
      date: "2025-03-25",
      content:
        "읽으면서 여러 번 생각이 멈췄습니다. 인류의 역사를 거시적인 관점에서 바라보는 시각이 인상적이었어요.",
    },
    {
      id: 5,
      username: "철학자",
      user_id: "user5",
      rating: 3,
      date: "2025-03-20",
      content:
        "흥미로운 주제이지만 몇몇 부분에서는 논리적 비약이 있어 아쉬웠습니다. 그래도 읽을 가치가 있는 책입니다.",
    },
    {
      id: 6,
      username: "역사학도",
      user_id: "user6",
      rating: 4,
      date: "2025-03-15",
      content:
        "방대한 역사를 압축해서 보여주는 저자의 능력이 돋보이는 책입니다.",
    },
    {
      id: 7,
      username: "책사랑",
      user_id: "user7",
      rating: 5,
      date: "2025-03-10",
      content:
        "이 책을 통해 인류 역사의 큰 흐름을 이해할 수 있었습니다. 특히 농업혁명이 가져온 변화에 대한 설명이 인상적이었어요.",
    },
    {
      id: 8,
      username: "생각하는인간",
      user_id: "user8",
      rating: 4,
      date: "2025-03-05",
      content:
        "인류의 역사를 이해하는 새로운 시각을 제공해주는 책입니다. 다만 일부 해석은 논쟁의 여지가 있어요.",
    },
    {
      id: 9,
      username: "북러버",
      user_id: "user9",
      rating: 5,
      date: "2025-02-28",
      content:
        "한 권으로 인류의 역사를 조망할 수 있는 멋진 책입니다. 여러 번 읽을수록 새로운 통찰을 얻게 되는 것 같아요.",
    },
    {
      id: 10,
      username: "독서매니아",
      user_id: "user10",
      rating: 4,
      date: "2025-02-20",
      content:
        "단숨에 읽게 되는 흡입력 있는 책입니다. 복잡한 개념도 쉽게 설명해주어 좋았어요.",
    },
  ];

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 실제 구현에서는 API로 데이터를 가져오게 됩니다
        setBook(mockBook);
        setAllReviews(mockReviews);
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
        toast({
          title: "데이터를 불러오는 데 실패했습니다",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]); // id가 변경될 때만 데이터를 다시 로드합니다

  // 필터링 및 정렬 로직
  useEffect(() => {
    if (!allReviews.length) return;

    let reviews = [...allReviews];

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      reviews = reviews.filter(
        (review) =>
          review.content.toLowerCase().includes(query) ||
          review.username.toLowerCase().includes(query)
      );
    }

    // 별점 필터링
    if (filterRating !== "all") {
      const rating = parseInt(filterRating);
      reviews = reviews.filter((review) => review.rating === rating);
    }

    // 정렬
    reviews.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else {
        // lowest
        return a.rating - b.rating;
      }
    });

    setFilteredReviews(reviews);
    setTotalPages(Math.ceil(reviews.length / REVIEWS_PER_PAGE));
    setCurrentPage(1); // 필터링이나 정렬이 변경되면 첫 페이지로 돌아갑니다
  }, [allReviews, searchQuery, filterRating, sortBy]);

  // 페이지네이션 로직
  useEffect(() => {
    if (!filteredReviews.length) {
      setDisplayedReviews([]);
      return;
    }

    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    const end = start + REVIEWS_PER_PAGE;
    setDisplayedReviews(filteredReviews.slice(start, end));
  }, [filteredReviews, currentPage]);

  // 뒤로 가기
  const handleGoBack = () => {
    navigate(`/book/${id}`);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 별점 선택
  const handleRatingSelect = (rating: number) => {
    setUserRating(rating === userRating ? null : rating);
  };

  // 리뷰 제출
  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast({
        title: "로그인이 필요합니다",
        description: "리뷰를 작성하려면 먼저 로그인해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!userRating) {
      toast({
        title: "별점을 선택해주세요",
        description: "리뷰 작성 시 별점은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    if (!reviewContent.trim()) {
      toast({
        title: "리뷰 내용을 입력해주세요",
        description: "리뷰 내용은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    // 새 리뷰 생성
    const newReview: Review = {
      id: Date.now(),
      username: "사용자", // 실제 구현에서는 로그인한 사용자 정보를 사용합니다
      user_id: "current_user",
      rating: userRating,
      date: new Date().toISOString().split("T")[0],
      content: reviewContent,
    };

    // 리뷰 목록에 새 리뷰 추가
    setAllReviews([newReview, ...allReviews]);

    // 폼 초기화
    setReviewContent("");
    setUserRating(null);

    // 성공 메시지
    toast({
      title: "리뷰가 등록되었습니다",
      description: "소중한 의견을 공유해주셔서 감사합니다.",
    });
  };

  // 리뷰 작성 폼
  const ReviewForm = () => (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-1 flex flex-col">
        <h2 className="text-xl font-bold mb-4">리뷰 작성</h2>

        {/* 별점 선택 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">별점</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingSelect(rating)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 cursor-pointer ${
                    userRating && rating <= userRating
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 flex items-center text-gray-600">
              {userRating ? `${userRating}점` : "별점을 선택해주세요"}
            </span>
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="flex flex-col flex-1">
          <p className="text-sm text-gray-600 mb-2">리뷰 내용</p>
          <Textarea
            placeholder="이 책에 대한 생각을 자유롭게 작성해주세요."
            className="flex-1 mb-4 min-h-[120px]"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitReview}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!userRating || !reviewContent.trim()}
            >
              리뷰 등록하기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // 리뷰 필터 및 검색 컴포넌트
  const ReviewFilters = () => (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 className="text-xl font-bold">
        독자 리뷰 ({filteredReviews.length})
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="리뷰 검색..."
            className="pl-9 pr-4 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filterRating}
            onValueChange={(value) => setFilterRating(value)}
          >
            <SelectTrigger className="w-[120px] h-10">
              <SelectValue placeholder="별점" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 별점</SelectItem>
              <SelectItem value="5">5점</SelectItem>
              <SelectItem value="4">4점</SelectItem>
              <SelectItem value="3">3점</SelectItem>
              <SelectItem value="2">2점</SelectItem>
              <SelectItem value="1">1점</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[120px] h-10">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">최신순</SelectItem>
              <SelectItem value="highest">별점 높은순</SelectItem>
              <SelectItem value="lowest">별점 낮은순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // 리뷰 없음 메시지
  const NoReviews = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
      <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">등록된 리뷰가 없습니다</h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        {searchQuery || filterRating !== "all"
          ? "검색 조건에 맞는 리뷰가 없습니다. 다른 조건으로 검색해보세요."
          : "이 책에 대한 첫 리뷰를 작성해보세요!"}
      </p>
    </div>
  );

  // 로딩 메시지
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <Button variant="ghost" onClick={handleGoBack} className="pl-0">
          <ArrowLeft className="h-5 w-5 mr-2" />
          도서 상세로 돌아가기
        </Button>
      </div>

      {/* 책 정보와 리뷰 폼 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 mb-8">
        {/* 좌측: 책 정보 */}
        {book && (
          <div className="md:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <BookCover
                book={{
                  id: parseInt(book.book_id),
                  title: book.book_name,
                  author: book.author,
                  cover: book.book_image,
                  category: book.genre_name || "기타",
                  rating: book.rating,
                }}
                className="mx-auto md:mx-0 w-full max-w-[180px] md:max-w-full"
              />
            </div>
          </div>
        )}

        {/* 우측: 리뷰 작성 폼 */}
        <div className="md:col-span-4">
          <ReviewForm />
        </div>
      </div>

      {/* 리뷰 필터 및 검색 */}
      <ReviewFilters />

      {/* 리뷰 목록 */}
      {isLoading ? (
        <LoadingIndicator />
      ) : filteredReviews.length === 0 ? (
        <NoReviews />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              username={review.username}
              user_id={review.user_id}
              rating={review.rating}
              date={review.date}
              content={review.content}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {!isLoading && filteredReviews.length > REVIEWS_PER_PAGE && (
        <div className="mt-8 flex justify-center">
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default BookReviewsPage;
