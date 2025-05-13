import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import BookCover from "@/components/book/BookCover";
import ReviewList from "@/components/review/ReviewList";
import ReviewFilters from "@/components/review/ReviewFilters";
import ReviewForm from "@/components/review/ReviewForm";
import reviewService, { Review } from "@/utils/api/reviewService"; // 수정된 import

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
  const { isAuthenticated } = useAuth();

  // 상태 관리
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [reviewContent, setReviewContent] = useState("");
  const [userRating, setUserRating] = useState<number | null>(null);
  const [pageSize] = useState(6);
  const [loadingRequest, setLoadingRequest] = useState(false);

  // 테스트용 책 데이터 - 실제로는 API로 대체 예정
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

  // 리뷰 데이터 로드 함수 - 수정된 부분: reviewService 사용
  const loadReviews = async (page = 1) => {
    if (loadingRequest) return; // 이미 요청 중이면 중복 요청 방지

    setLoadingRequest(true);
    setIsLoading(true);

    try {
      // reviewService를 사용하여 리뷰 데이터 로드
      const response = await reviewService.getBookReviews(id, page, pageSize);
      const { reviews, pagination, summary } = response.data;

      setReviews(reviews);
      setFilteredReviews(reviews);
      setTotalPages(pagination.totalPages || 1);
      setTotalReviews(summary.totalReviews);
      setAverageRating(summary.averageRating);
    } catch (error) {
      console.error("리뷰 데이터 로드 중 오류 발생:", error);
      toast.error("리뷰를 불러오는 데 실패했습니다", {
        description: "잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
      setLoadingRequest(false);
    }
  };

  // 책 정보 로드 함수
  const loadBookInfo = async () => {
    try {
      // 실제 구현에서는 API로 책 정보를 가져옵니다
      // const response = await axios.get(`${API_BASE_URL}/books/${id}`);
      // setBook(response.data.data);

      // 현재는 mock 데이터를 사용합니다
      setBook(mockBook);
    } catch (error) {
      console.error("책 정보 로드 중 오류 발생:", error);
      toast.error("책 정보를 불러오는 데 실패했습니다", {
        description: "잠시 후 다시 시도해주세요.",
      });
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (id) {
      loadBookInfo();
      loadReviews(1);
    }
  }, [id]);

  // 현재 페이지가 변경되면 리뷰 데이터를 다시 로드
  useEffect(() => {
    if (id && !isLoading) {
      loadReviews(currentPage);
    }
  }, [currentPage]);

  // 필터링 로직
  useEffect(() => {
    if (!reviews.length) return;

    let filtered = [...reviews];

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.text.toLowerCase().includes(query) ||
          review.email.toLowerCase().includes(query)
      );
    }

    // 별점 필터링
    if (filterRating !== "all") {
      const rating = parseInt(filterRating);
      filtered = filtered.filter(
        (review) => Math.floor(review.rating) === rating
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else {
        // lowest
        return a.rating - b.rating;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, filterRating, sortBy]);

  // 뒤로 가기
  const handleGoBack = () => {
    navigate(`/book/${id}`);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // 리뷰 제출 - 수정된 부분: reviewService 사용
  const handleSubmitReview = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!isAuthenticated || !accessToken) {
      toast.error("로그인이 필요합니다", {
        description: "리뷰를 작성하려면 먼저 로그인해주세요.",
      });
      return;
    }

    if (!userRating) {
      toast.error("별점을 선택해주세요", {
        description: "리뷰 작성 시 별점은 필수입니다.",
      });
      return;
    }

    if (!reviewContent.trim()) {
      toast.error("리뷰 내용을 입력해주세요", {
        description: "리뷰 내용은 필수입니다.",
      });
      return;
    }

    try {
      const reviewData = {
        rating: userRating,
        text: reviewContent,
      };

      // reviewService를 사용하여 리뷰 작성
      await reviewService.createReview(id, reviewData, accessToken);

      // 리뷰 등록 후 폼 초기화
      setReviewContent("");
      setUserRating(null);

      // 리뷰 목록 새로고침
      loadReviews(currentPage);

      // 성공 메시지
      toast.success("리뷰가 등록되었습니다", {
        description: "소중한 의견을 공유해주셔서 감사합니다.",
      });
    } catch (error) {
      console.error("리뷰 등록 중 오류 발생:", error);
      toast.error("리뷰 등록에 실패했습니다", {
        description: "잠시 후 다시 시도해주세요.",
      });
    }
  };

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

        {/* 우측: 리뷰 작성 폼 - 분리된 컴포넌트 사용 */}
        <div className="md:col-span-4">
          <ReviewForm
            isAuthenticated={isAuthenticated}
            userRating={userRating}
            setUserRating={setUserRating}
            reviewContent={reviewContent}
            setReviewContent={setReviewContent}
            handleSubmitReview={handleSubmitReview}
            navigate={navigate}
          />
        </div>
      </div>

      {/* 리뷰 필터 및 검색 - 분리된 컴포넌트 사용 */}
      <ReviewFilters
        totalReviews={totalReviews}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterRating={filterRating}
        setFilterRating={setFilterRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* 리뷰 목록 - 분리된 컴포넌트 사용 */}
      <ReviewList
        isLoading={isLoading}
        filteredReviews={filteredReviews}
        searchQuery={searchQuery}
        filterRating={filterRating}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BookReviewsPage;
