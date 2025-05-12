import { useState, useEffect } from "react";
import { Heart, Trash2, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// 책 타입 정의
interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  rating?: number;
  addedDate: string;
}

const WishlistPage = () => {
  const { toast } = useToast();

  // 상태 관리
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // 초기 데이터 로드
  useEffect(() => {
    // 목업 데이터
    const mockBooks: Book[] = [
      {
        id: 1,
        title: "세계 문학의 이해",
        author: "김민수",
        category: "문학",
        rating: 4.5,
        addedDate: "2025-05-10",
      },
      {
        id: 2,
        title: "인공지능의 미래",
        author: "이지은",
        category: "기술과학",
        rating: 4.8,
        addedDate: "2025-05-08",
      },
      {
        id: 3,
        title: "역사 속의 인물들",
        author: "정태영",
        category: "역사",
        rating: 4.2,
        addedDate: "2025-05-05",
      },
      {
        id: 4,
        title: "현대 심리학 개론",
        author: "박서연",
        category: "철학",
        rating: 4.6,
        addedDate: "2025-05-01",
      },
      {
        id: 5,
        title: "우주의 신비",
        author: "최우주",
        category: "자연과학",
        rating: 4.7,
        addedDate: "2025-04-28",
      },
      {
        id: 6,
        title: "디지털 마케팅 전략",
        author: "한지민",
        category: "사회과학",
        rating: 4.3,
        addedDate: "2025-04-25",
      },
      {
        id: 7,
        title: "현대 미술의 이해",
        author: "이하늘",
        category: "예술",
        rating: 4.1,
        addedDate: "2025-04-20",
      },
      {
        id: 8,
        title: "효과적인 프로그래밍",
        author: "정코딩",
        category: "기술과학",
        rating: 4.9,
        addedDate: "2025-04-15",
      },
    ];

    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  // 필터링 및 정렬
  useEffect(() => {
    let result = [...books];

    // 카테고리 필터링
    if (selectedCategory !== "all") {
      const categoryMap = {
        "100": "철학",
        "300": "사회과학",
        "400": "자연과학",
        "500": "기술과학",
        "600": "예술",
        "800": "문학",
        "900": "역사",
      };

      result = result.filter(
        (book) => book.category === categoryMap[selectedCategory]
      );
    }

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    // 정렬
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
        );
        break;
      case "title_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating_high":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating_low":
        result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
    }

    setFilteredBooks(result);
  }, [books, searchQuery, selectedCategory, sortBy]);

  // 책 삭제
  const removeBook = (id: number) => {
    setBooks(books.filter((book) => book.id !== id));
    toast({
      title: "도서 삭제",
      description: "관심 도서에서 삭제되었습니다.",
    });
  };

  // 책 상세보기
  const viewBookDetail = (id: number) => {
    toast({
      title: "도서 상세보기",
      description: `도서 ID: ${id}`,
    });
    // 실제 구현에서는 페이지 이동
    // navigate(`/book/${id}`);
  };

  return (
    <div className="container mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">관심 도서</h1>
        <Badge variant="outline" className="px-2 py-1">
          총 {filteredBooks.length}권
        </Badge>
      </div>

      {/* 도서 목록 */}
      {filteredBooks.length === 0 ? (
        <Card className="border-dashed bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery || selectedCategory !== "all"
                ? "검색 결과가 없습니다"
                : "관심 도서가 없습니다"}
            </h3>
            <p className="text-gray-500 mb-4 text-center max-w-md">
              {searchQuery || selectedCategory !== "all"
                ? "다른 검색어나 필터 조건을 사용해보세요."
                : "관심있는 도서를 추가해보세요."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              {searchQuery || selectedCategory !== "all"
                ? "필터 초기화"
                : "도서 탐색하기"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                {/* 책 커버 (색상 블록으로 대체) */}
                <div
                  className="h-40 flex items-center justify-center relative cursor-pointer"
                  style={{
                    background: `hsl(${book.id * 40}, 70%, 80%)`,
                  }}
                  onClick={() => viewBookDetail(book.id)}
                >
                  <div className="text-center text-gray-700 font-medium px-4">
                    {book.title}
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBook(book.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>

                  {/* 상세보기 버튼 */}
                  <button
                    className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewBookDetail(book.id);
                    }}
                  >
                    <Info className="w-4 h-4 text-blue-500" />
                  </button>
                </div>

                {/* 책 정보 */}
                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-1 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3">{book.author}</p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {book.category}
                    </Badge>
                    <div className="flex items-center text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{book.rating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
