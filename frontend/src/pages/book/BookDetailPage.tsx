import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  Calendar,
  Book,
  Hash,
  Star,
  User,
  Building,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ReviewCard from "@/components/review/ReviewCard";
import bookService from "@/utils/api/bookService";
import reviewService from "@/utils/api/reviewService";
import { BookDetail, BookDetailResponse } from "@/types/book";
import { Review } from "@/utils/api/reviewService"; // 리뷰 타입 import

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLibraryAdded, setIsLibraryAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [book, setBook] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 스크롤 이벤트 핸들러 추가
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 책 정보 로드
  useEffect(() => {
    const loadBookDetail = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await bookService.getBookDetail(id);
        setBook(response.data.data);
      } catch (error) {
        console.error("책 정보 로드 중 오류 발생:", error);
        setError(
          "책 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요."
        );
        toast.error("책 정보를 불러오는 데 실패했습니다", {
          description: "잠시 후 다시 시도해주세요.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBookDetail();
  }, [id]);

  // 책 리뷰 로드
  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;

      setIsLoadingReviews(true);
      try {
        const response = await reviewService.getLatestReviews(id, 3);
        const { reviews, summary } = response.data;

        setReviews(reviews);
        setTotalReviews(summary.totalReviews);
        setAverageRating(summary.averageRating);
      } catch (error) {
        console.error("리뷰 로드 중 오류 발생:", error);
        toast.error("리뷰를 불러오는 데 실패했습니다", {
          description: "잠시 후 다시 시도해주세요.",
        });
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (id) {
      loadReviews();
    }
  }, [id]);

  // 책 정보 로드
  useEffect(() => {
    const loadBookDetail = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await bookService.getBookDetail(id);
        setBook(response.data.data);
      } catch (error) {
        console.error("책 정보 로드 중 오류 발생:", error);
        setError(
          "책 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요."
        );
        toast.error("책 정보를 불러오는 데 실패했습니다", {
          description: "잠시 후 다시 시도해주세요.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBookDetail();
  }, [id]);

  // 내 서재에 추가 버튼 클릭 시 다이얼로그 열기
  const handleAddToLibrary = async () => {
    if (!id) return;

    try {
      await bookService.addToLibrary(id);
      setIsLibraryAdded(true);
      setIsDialogOpen(true);
      toast.success("내 서재에 추가되었습니다");
    } catch (error) {
      console.error("서재 추가 중 오류 발생:", error);
      toast.error("서재에 추가하는 데 실패했습니다", {
        description: "잠시 후 다시 시도해주세요.",
      });
    }
  };

  // 관심 도서에 추가 버튼 클릭
  const handleAddToWishlist = async () => {
    if (!id) return;

    try {
      await bookService.toggleWishlist(id);
      setIsWishlisted(!isWishlisted);
      toast.success(
        isWishlisted
          ? "관심 도서에서 제거되었습니다"
          : "관심 도서에 추가되었습니다"
      );
    } catch (error) {
      console.error("관심 도서 토글 중 오류 발생:", error);
      toast.error("요청 처리 중 오류가 발생했습니다", {
        description: "잠시 후 다시 시도해주세요.",
      });
    }
  };

  const handleReadBook = () => {
    setIsDialogOpen(false);

    // 새 탭에서 열기
    window.open(`/read/${id}`, "_blank");
  };

  // 뒤로 가기
  const handleGoBack = () => {
    navigate(-1);
  };

  // 설명 더보기/접기 토글
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // 리뷰 페이지로 이동
  const navigateToReviews = () => {
    navigate(`/book/${id}/reviews`);
  };

  // 리뷰 렌더링
  const renderReviews = () => {
    if (isLoadingReviews) {
      return (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">리뷰를 불러오는 중...</p>
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">아직 등록된 리뷰가 없습니다.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={navigateToReviews}
          >
            첫 리뷰를 작성해보세요!
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            id={review.id}
            username={review.email.split("@")[0]} // 이메일에서 아이디 부분만 표시
            user_id={review.email}
            rating={review.rating}
            date={new Date(review.createdAt).toISOString().split("T")[0]} // 날짜 형식 변환
            content={review.text}
          />
        ))}
      </div>
    );
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">책 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 표시
  if (error || !book) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <div className="bg-red-100 p-6 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">오류 발생</h2>
          <p className="text-gray-700">
            {error || "책 정보를 불러올 수 없습니다."}
          </p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  // 기본 이미지 URL 옵션들 (book.image가 null인 경우)
  const placeholderOptions = [
    // 책 스타일 플레이스홀더 (푸른색)
    "https://placehold.co/400x600/e8eaf2/4a6fa5?text=No+Cover+Available&font=montserrat",
    // 책 스타일 플레이스홀더 (빨간색)
    "https://placehold.co/400x600/f5e6e8/9e3f3f?text=Cover+Coming+Soon&font=montserrat",
    // 책 스타일 플레이스홀더 (녹색)
    "https://placehold.co/400x600/e8f0e6/3e733f?text=No+Image+Available&font=montserrat",
  ];

  // 책 ID를 기반으로 일관된 플레이스홀더 이미지 선택 (책마다 다른 이미지가 표시되지 않도록)
  const placeholderIndex = 0; // 첫 번째 옵션 항상 사용 (원하는 경우 id를 기반으로 계산 가능)
  const bookImage = book.image || placeholderOptions[placeholderIndex];

  return (
    <div className="pb-12">
      <div className="container mx-auto">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="pl-0">
            <ArrowLeft className="h-5 w-5 mr-2" />
            돌아가기
          </Button>
        </div>

        {/* 고정 헤더 및 콘텐츠 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-14">
          {/* 왼쪽: 스크롤해도 고정되는 책 커버 및 버튼 영역 */}
          <div className="md:col-span-3">
            <div className={`md:sticky md:top-24`}>
              <div className="flex flex-col items-center">
                <div className="w-48 md:w-full shadow-lg rounded-lg overflow-hidden bg-white">
                  <img
                    src={bookImage}
                    alt={book.name}
                    className="w-full object-cover"
                  />
                </div>

                {/* 별점 및 리뷰 수 - 모바일에서만 표시 */}
                <div className="md:hidden flex items-center mt-4 mb-4">
                  <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="ml-1 font-medium text-yellow-700">
                      {averageRating}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({totalReviews})
                    </span>
                  </div>
                </div>

                {/* 버튼 영역 */}
                <div className="w-full mt-6 flex flex-col gap-3">
                  <Button
                    className={`w-full ${
                      isLibraryAdded
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={handleAddToLibrary}
                  >
                    {isLibraryAdded ? (
                      <>
                        <BookOpen className="h-5 w-5 mr-2" />
                        서재에 추가됨
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-5 w-5 mr-2" />내 서재에 추가
                      </>
                    )}
                  </Button>

                  <Button
                    variant={isWishlisted ? "secondary" : "outline"}
                    className="w-full"
                    onClick={handleAddToWishlist}
                  >
                    <Heart
                      className={`h-5 w-5 mr-2 ${
                        isWishlisted ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {isWishlisted ? "관심 도서 추가됨" : "관심 도서에 추가"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 책 상세 정보 */}
          <div className="md:col-span-9">
            {/* 제목 및 기본 정보 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className="bg-blue-600">{book.category.major}</Badge>
                  {book.category.sub && (
                    <Badge variant="outline">{book.category.sub}</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{book.name}</h1>
              </div>

              {/* 별점 및 리뷰 수 - 데스크탑에서만 */}
              <div className="hidden md:flex items-center">
                <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="ml-1 font-medium text-yellow-700">
                    {averageRating}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({totalReviews})
                  </span>
                </div>
              </div>
            </div>

            {/* 저자, 출판사 정보 */}
            <div className="flex flex-wrap gap-y-1 gap-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700">저자: </span>
                <span className="ml-1 font-medium">{book.author.name}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700">출판사: </span>
                <span className="ml-1 font-medium">{book.publisher.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700">출간일: </span>
                <span className="ml-1 font-medium">{book.pubDate}</span>
              </div>
              {/* 페이지 정보는 API 응답에 없어서 생략 */}
              <div className="flex items-center">
                <Hash className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm">ISBN: {book.isbn}</span>
              </div>
              {book.ecn && (
                <div className="flex items-center">
                  <Hash className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm">e-ISBN: {book.ecn}</span>
                </div>
              )}
            </div>
            <hr className="mt-6" />
            <div className="mt-6 md:mt-6 ">
              {/* 책 설명 */}
              <div>
                <h3 className="font-medium text-lg mb-4">도서 소개</h3>
                <div
                  className={`text-gray-700 leading-relaxed ${
                    !showFullDescription && "line-clamp-4"
                  }`}
                >
                  {book.description}
                </div>
                {book.description && book.description.length > 200 && (
                  <Button
                    variant="ghost"
                    className="mt-2 text-blue-600 flex items-center"
                    onClick={toggleDescription}
                  >
                    {showFullDescription ? (
                      <>
                        접기 <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        더 보기 <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
              <hr className="mt-6" />
              <div className="flex items-center justify-between mb-4 mt-6">
                <h3 className="font-medium text-lg">독자 리뷰</h3>
                <Button variant="outline" size="sm" onClick={navigateToReviews}>
                  리뷰 작성하기
                </Button>
              </div>

              {/* API에서 가져온 리뷰 렌더링 */}
              {renderReviews()}

              {/* 리뷰 더 보기 버튼 추가 */}
              {!isLoadingReviews && reviews.length > 0 && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={navigateToReviews}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    리뷰 {totalReviews}개 모두 보기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 내 서재에 추가 확인 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>서재에 추가되었습니다</DialogTitle>
            <DialogDescription>
              {book.name}이(가) 내 서재에 추가되었습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <img
              src={bookImage}
              alt={book.name}
              className="h-60 w-40 rounded-md shadow-md"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="sm:flex-1"
            >
              책 더 구경하기
            </Button>
            <Button
              onClick={handleReadBook}
              className="bg-blue-600 hover:bg-blue-700 sm:flex-1"
            >
              지금 읽기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookDetailPage;
