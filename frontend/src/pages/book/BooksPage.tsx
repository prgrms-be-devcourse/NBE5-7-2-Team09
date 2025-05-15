// src/pages/book/BooksPage.tsx (모바일 검색 페이지 제외)
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Book, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { bookService } from "@/utils/api/bookService";

// 책 타입 정의
interface Author {
  id: number;
  name: string;
}

interface Publisher {
  id: number;
  name: string;
}

interface Category {
  id: number;
  major: string;
  sub: string;
}

interface Book {
  id: number;
  name: string;
  image: string;
  isbn: string;
  ecn: string;
  pubDate: string;
  category: Category;
  publisher: Publisher;
  author: Author;
}

interface BooksResponse {
  books: Book[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// KDC 한국십진분류법 기반 카테고리
const categories = [
  { id: "all", name: "전체" },
  { id: "000", name: "총류" },
  { id: "100", name: "철학" },
  { id: "200", name: "종교" },
  { id: "300", name: "사회과학" },
  { id: "400", name: "자연과학" },
  { id: "500", name: "기술과학" },
  { id: "600", name: "예술" },
  { id: "700", name: "언어" },
  { id: "800", name: "문학" },
  { id: "900", name: "역사" },
];

const BooksPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 검색어, 카테고리, 페이지 값 가져오기
  const searchQuery = searchParams.get("query") || "";
  const categoryId = searchParams.get("category") || "all";
  const page = parseInt(searchParams.get("page") || "1");

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const pageSize = 20; // 한 페이지에 표시할 책 개수

  // 현재 선택된 카테고리명 가져오기
  const getCurrentCategoryName = () => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "전체";
  };

  // 페이지 제목 설정
  const getPageTitle = () => {
    if (searchQuery) {
      return `"${searchQuery}" 검색 결과`;
    } else {
      return `${getCurrentCategoryName()} 도서`;
    }
  };

  // 책 목록 조회
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      let url = `/books?page=${currentPage}&size=${pageSize}`;

      // 카테고리가 전체가 아닌 경우 카테고리 필터 추가
      if (categoryId && categoryId !== "all") {
        url += `&category_major=${categoryId}`;
      }

      // 검색어가 있는 경우 검색어 추가
      if (searchQuery) {
        url += `&query=${encodeURIComponent(searchQuery)}`;
      }

      const response = await bookService.getBooks(url);

      // 응답 데이터 처리
      if (response.code === 200) {
        const data = response.data;
        setBooks(data.books);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCurrentPage(data.currentPage);
      } else {
        throw new Error("책 목록을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("책 목록 조회 실패", {
        description: "책 목록을 불러오는 중 오류가 발생했습니다.",
      });
      // 에러 발생 시 빈 배열로 초기화
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지, 카테고리, 검색어가 변경될 때 책 목록 다시 조회
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `/books?page=${page}&size=${pageSize}`;
        // URL 구성...

        const response = await bookService.getBooks(url);

        // 컴포넌트가 여전히 마운트되어 있을 때만 상태 업데이트
        if (isMounted) {
          if (response.code === 200) {
            const data = response.data;
            setBooks(data.books);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setCurrentPage(data.currentPage);
          } else {
            throw new Error("책 목록을 불러오는데 실패했습니다.");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching books:", error);
          toast.error("책 목록 조회 실패", {
            description: "책 목록을 불러오는 중 오류가 발생했습니다.",
          });
          setBooks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, [categoryId, searchQuery, page, pageSize]);

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    // URL 파라미터 업데이트
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  // 카테고리 변경 처리
  const handleCategoryChange = (selectedCategoryId: string) => {
    // URL 변경
    const newParams = new URLSearchParams();

    if (selectedCategoryId !== "all") {
      newParams.set("category", selectedCategoryId);
    }

    if (searchQuery) {
      newParams.set("query", searchQuery);
    }

    // 카테고리 변경 시 첫 페이지로 이동
    newParams.set("page", "1");

    setSearchParams(newParams);
  };

  // 책 상세 페이지로 이동
  const navigateToBookDetail = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  // 로딩 중 스켈레톤 UI
  const renderSkeletons = () => {
    return Array(12)
      .fill(0)
      .map((_, index) => (
        <Card key={`skeleton-${index}`} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-[2/3] w-full" />
          </CardContent>
          <CardFooter className="px-3 py-2 bg-white flex flex-col items-start gap-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardFooter>
        </Card>
      ));
  };

  return (
    <div className="container mx-auto py-6 mt-20">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">{getPageTitle()}</h1>

          {/* 카테고리 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {getCurrentCategoryName()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={
                    categoryId === category.id ? "bg-slate-100 font-medium" : ""
                  }
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 검색 결과 정보 */}
        {!isLoading && books.length > 0 && (
          <p className="text-gray-600">
            총 {totalElements}개의 도서를 찾았습니다.
          </p>
        )}
      </div>

      {/* 책 그리드 */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {renderSkeletons()}
        </div>
      ) : books.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">책이 없습니다</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
              : categoryId !== "all"
              ? `"${getCurrentCategoryName()}" 카테고리에 등록된 책이 없습니다.`
              : "등록된 책이 없습니다."}
          </p>
          <Button
            variant="default"
            onClick={() => {
              setSearchParams(new URLSearchParams());
              navigate("/books");
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            전체 도서 보기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToBookDetail(book.id)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3]">
                  <img
                    src={book.image}
                    alt={book.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-book.png";
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="px-3 py-2 bg-white flex flex-col items-start">
                <h3 className="font-medium text-sm line-clamp-2 w-full">
                  {book.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{book.author.name}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {!isLoading && books.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default BooksPage;
