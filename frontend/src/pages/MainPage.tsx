import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookCover from "@/components/book/BookCover";

const MainPage = () => {
  const navigate = useNavigate();

  // 가상 도서 데이터
  const popularBooks = [
    {
      id: 1,
      title: "사피엔스",
      author: "유발 하라리",
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788934972464.jpg",
      rating: 4.8,
      category: "인문",
      isBestseller: true,
    },
    {
      id: 2,
      title: "코스모스",
      author: "칼 세이건",
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788983711892.jpg",
      rating: 4.9,
      category: "과학",
      isBestseller: true,
    },
    {
      id: 3,
      title: "도둑맞은 집중력",
      author: "요한 하리",
      cover: "https://image.yes24.com/goods/118579613/XL",
      rating: 4.6,
      category: "자기계발",
      isBestseller: false,
    },
    {
      id: 4,
      title: "아몬드",
      author: "손원평",
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936434267.jpg",
      rating: 4.7,
      category: "소설",
      isBestseller: true,
    },
    {
      id: 5,
      title: "소크라테스 익스프레스",
      author: "에릭 와이너",
      cover:
        "https://item.elandrs.com/upload/prd/orgimg/159/2108491159_0000001.jpg?w=750&h=&q=100",
      rating: 4.5,
      category: "인문",
      isBestseller: false,
    },
  ];

  const newBooks = [
    {
      id: 101,
      title: "디지털 미니멀리즘",
      author: "칼 뉴포트",
      cover: "https://image.yes24.com/goods/74031339/XL",
      publishDate: "2025-04-15",
      category: "자기계발",
      isNew: true,
    },
    {
      id: 102,
      title: "인생의 마지막 순간에서",
      author: "정현기",
      cover: "https://image.yes24.com/goods/74644329/XL",
      publishDate: "2025-04-10",
      category: "에세이",
      isNew: true,
    },
    {
      id: 103,
      title: "파피용",
      author: "베르나르 베르베르",
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788932923864.jpg",
      publishDate: "2025-04-05",
      category: "소설",
      isNew: true,
    },
    {
      id: 104,
      title: "꿀벌의 민주주의",
      author: "토마스 시리",
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788962630671.jpg",
      publishDate: "2025-04-01",
      category: "과학",
      isNew: true,
    },
    {
      id: 105,
      title: "내가 틀릴 수도 있습니다",
      author: "비욘 나티코 린데블라드",
      cover: "https://image.yes24.com/goods/108850617/XL",
      publishDate: "2025-03-28",
      category: "심리학",
      isNew: false,
    },
  ];

  // 가로 스크롤 함수
  const scrollSection = (sectionId: any, direction: any) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const scrollAmount = direction === "left" ? -400 : 400;
      section.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // 책 상세 페이지로 이동하는 함수
  const navigateToBookDetail = (bookId: any) => {
    navigate(`/book/${bookId}`);
  };

  // 책 렌더링 함수
  const renderBook = (book: any, isNewRelease = false) => (
    <div
      key={book.id}
      className="flex-shrink-0 w-40 md:w-64 cursor-pointer"
      onClick={() => navigateToBookDetail(book.id)}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-96 object-cover"
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
                <span>{book.publishDate.slice(5)}</span>
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

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mb-8">
        <div className="container mx-auto px-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              당신의 지식과 상상력을 넓히는 공간
            </h1>
            <p className="text-lg md:text-xl mb-6">
              북스페이스에서 다양한 도서를 언제 어디서나 만나보세요
            </p>
            <div className="flex gap-3">
              <Button className="bg-white text-blue-700 hover:bg-gray-100">
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 인기 도서 섹션 */}
      <section className="container mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">인기 도서</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => scrollSection("popular-books", "left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => scrollSection("popular-books", "right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          id="popular-books"
          className="flex overflow-x-auto pb-4 scrollbar-hide gap-4"
        >
          {popularBooks.map((book) => (
            <BookCover
              key={book.id}
              book={book}
              onClick={navigateToBookDetail}
            />
          ))}
        </div>
      </section>

      {/* 신간 도서 섹션 */}
      <section className="container mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">신간 도서</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => scrollSection("new-books", "left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => scrollSection("new-books", "right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          id="new-books"
          className="flex overflow-x-auto pb-4 scrollbar-hide gap-4"
        >
          {newBooks.map((book) => renderBook(book, true))}
        </div>
      </section>

      {/* 이벤트 섹션 */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-xl font-bold mb-4">이벤트 및 프로모션</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">첫 가입 30일 무료</h3>
            <p className="mb-4">
              지금 가입하시면 30일간 무료로 모든 도서를 이용할 수 있습니다.
            </p>
            <Button className="bg-white text-purple-700 hover:bg-gray-100">
              자세히 보기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
