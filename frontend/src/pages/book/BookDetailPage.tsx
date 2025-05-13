import React, { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import BookCover from "@/components/book/BookCover";
import ReviewCard from "@/components/review/ReviewCard"; // 추가된 import

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLibraryAdded, setIsLibraryAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  // 실제 구현에서는 id를 사용하여 서버에서 책 정보를 가져와야 합니다.
  // 여기서는 샘플 데이터를 사용합니다.
  const bookData = {
    book_id: id,
    book_name: "사피엔스",
    author: "유발 하라리",
    publisher: "김영사",
    book_pub_date: "2015-11-24",
    book_image:
      "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788934972464.jpg",
    rating: 4.8,
    reviewCount: 1423,
    genre_name: "인문",
    book_page: 643,
    book_isbn: "9788934972464",
    book_ecn: "ECN-1234-5678",
    book_description: `
    <p>지구상에 어떻게 우리 종 하나만이 남게 되었는가</p>
    <p>10만 년 전, 지구에는 호모 사피엔스뿐만 아니라 네안데르탈인, 호모 에렉투스 등 최소 6종의 인간 종이 살아 있었다. 이후 호모 사피엔스 혼자만 살아남았고, 이제 그들이 지구와 그 미래를 결정짓게 되었다. 우리 종은 어떻게 유인원에서 사이보그가 되었고, 신에서 빅데이터가 될 것인가. 우리는 어디서 왔고, 어디로 가고 있는가?</p>
    <p>변방의 유인원 호모 사피엔스는 어떻게 세상의 지배자가 되었는가. 역사상 가장 기록이 잘 된 멸종 사건은 지금도 진행 중인가.</p>
    <p>『사피엔스』는 우리가 어떻게 지금의 우리가 되었는지에 대한 이야기이자, 인류 역사 속 거대한 흐름이 현대사회에서 어떤 양상으로 드러나는지를 보여주는 책이다. 호모 사피엔스의 탄생부터 지금까지 단일 종으로서의 인류가 어떻게 진화하고, 역사를 써 내려가고 있는지 일목요연하게 보여 준다.</p>
    <p>저자 유발 하라리는 사피엔스의 역사를 가능케 한 원동력으로 '허구를 믿는 능력'을 꼽는다. 그는 이렇게 말한다. "인간은 자기들이 지어낸 이야기를 왜 믿는가? 그것은 객관적 현실이 아니라 우리 종이 믿는 공통의 신화다. 이것을 이해하지 못하면 역사의 많은 부분을 이해할 수 없다."</p>
    `,
    reviews: [
      {
        id: 1,
        username: "독서광",
        rating: 5,
        date: "2025-04-10",
        content:
          "인류의 역사를 이렇게 흥미롭게 풀어낸 책은 처음입니다. 강력 추천합니다!",
      },
      {
        id: 2,
        username: "책벌레",
        rating: 4,
        date: "2025-04-05",
        content:
          "인류학을 처음 접하는 사람도 쉽게 읽을 수 있습니다. 다만 중반부가 조금 지루했어요.",
      },
      {
        id: 3,
        username: "지식탐험가",
        rating: 5,
        date: "2025-03-30",
        content:
          "인간이란 무엇인지, 우리는 어디서 왔고 어디로 가는지에 대한 통찰을 얻을 수 있는 책입니다.",
      },
    ],
    relatedBooks: [
      {
        id: 201,
        title: "호모 데우스",
        author: "유발 하라리",
        cover:
          "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788934982975.jpg",
      },
      {
        id: 202,
        title: "21세기를 위한 21가지 제언",
        author: "유발 하라리",
        cover:
          "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788901243214.jpg",
      },
      {
        id: 203,
        title: "총, 균, 쇠",
        author: "재레드 다이아몬드",
        cover:
          "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788970127248.jpg",
      },
    ],
  };

  // 내 서재에 추가 버튼 클릭 시 다이얼로그 열기
  const handleAddToLibrary = () => {
    setIsLibraryAdded(true);
    setIsDialogOpen(true);
  };

  // 관심 도서에 추가 버튼 클릭
  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
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
                    src={bookData.book_image}
                    alt={bookData.book_name}
                    className="w-full object-cover"
                  />
                </div>

                {/* 별점 및 리뷰 수 - 모바일에서만 표시 */}
                <div className="md:hidden flex items-center mt-4 mb-4">
                  <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="ml-1 font-medium text-yellow-700">
                      {bookData.rating}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({bookData.reviewCount})
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
                  <Badge className="bg-blue-600">{bookData.genre_name}</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {bookData.book_name}
                </h1>
              </div>

              {/* 별점 및 리뷰 수 - 데스크탑에서만 */}
              <div className="hidden md:flex items-center">
                <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="ml-1 font-medium text-yellow-700">
                    {bookData.rating}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({bookData.reviewCount})
                  </span>
                </div>
              </div>
            </div>

            {/* 저자, 출판사 정보 */}
            <div className="flex flex-wrap gap-y-1 gap-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700">저자: </span>
                <span className="ml-1 font-medium">{bookData.author}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700">출판사: </span>
                <span className="ml-1 font-medium">{bookData.publisher}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700">출간일: </span>
                <span className="ml-1 font-medium">
                  {bookData.book_pub_date}
                </span>
              </div>
              <div className="flex items-center">
                <Book className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm">페이지: {bookData.book_page}쪽</span>
              </div>
              <div className="flex items-center">
                <Hash className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm">ISBN: {bookData.book_isbn}</span>
              </div>
              <div className="flex items-center">
                <Hash className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm">e-ISBN: {bookData.book_ecn}</span>
              </div>
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
                  dangerouslySetInnerHTML={{
                    __html: bookData.book_description,
                  }}
                />
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
              </div>
              <hr className="mt-6" />
              <div className="flex items-center justify-between mb-4 mt-6">
                <h3 className="font-medium text-lg">독자 리뷰</h3>
                <Button variant="outline" size="sm" onClick={navigateToReviews}>
                  리뷰 작성하기
                </Button>
              </div>

              <div className="space-y-4">
                {bookData.reviews.slice(0, 3).map((review) => (
                  <ReviewCard
                    key={review.id}
                    id={review.id}
                    username={review.username}
                    rating={review.rating}
                    date={review.date}
                    content={review.content}
                  />
                ))}
              </div>

              {/* 리뷰 더 보기 버튼 추가 */}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={navigateToReviews}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  리뷰 {bookData.reviewCount}개 모두 보기
                </Button>
              </div>

              <hr className="mt-6" />
              <h3 className="font-medium text-lg mb-4 mt-6">
                함께 읽으면 좋은 책
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {bookData.relatedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100 flex flex-col"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <div className="aspect-[2/3] overflow-hidden relative w-full">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-3 flex-grow">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {book.title}
                      </h4>
                      <p className="text-gray-600 text-xs">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
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
              {bookData.book_name}이(가) 내 서재에 추가되었습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <img
              src={bookData.book_image}
              alt={bookData.book_name}
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
