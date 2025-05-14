// src/pages/library/LibraryDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { libraryService, Book as BookType } from "@/utils/api/libraryService";

const LibraryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const libraryId = parseInt(id || "0");
  const navigate = useNavigate();

  const [books, setBooks] = useState<BookType[]>([]);
  const [libraryName, setLibraryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editLibraryName, setEditLibraryName] = useState<string>("");
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  // 테스트용 데이터
  const mockBooks = [
    {
      book_id: 1,
      book_name: "사피엔스",
      book_image:
        "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788934972464.jpg",
    },
    {
      book_id: 2,
      book_name: "코스모스",
      book_image:
        "https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788983711892.jpg",
    },
    {
      book_id: 3,
      book_name: "도둑맞은 집중력",
      book_image: "https://image.yes24.com/goods/118579613/XL",
    },
    {
      book_id: 4,
      book_name: "아몬드",
      book_image:
        "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936434267.jpg",
    },
    {
      book_id: 5,
      book_name: "소크라테스 익스프레스",
      book_image:
        "https://item.elandrs.com/upload/prd/orgimg/159/2108491159_0000001.jpg?w=750&h=&q=100",
    },
    {
      book_id: 6,
      book_name: "디지털 미니멀리즘",
      book_image: "https://image.yes24.com/goods/74031339/XL",
    },
    {
      book_id: 7,
      book_name: "인생의 마지막 순간에서",
      book_image: "https://image.yes24.com/goods/74644329/XL",
    },
    {
      book_id: 8,
      book_name: "파피용",
      book_image:
        "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788932923864.jpg",
    },
    {
      book_id: 9,
      book_name: "꿀벌의 민주주의",
      book_image:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788962630671.jpg",
    },
    {
      book_id: 10,
      book_name: "내가 틀릴 수도 있습니다",
      book_image: "https://image.yes24.com/goods/108850617/XL",
    },
    {
      book_id: 11,
      book_name: "하늘과 바람과 별과 시",
      book_image:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936307073.jpg",
    },
    {
      book_id: 12,
      book_name: "지적 대화를 위한 넓고 얕은 지식",
      book_image:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788958285243.jpg",
    },
  ];

  // 테스트용 라이브러리 이름
  const mockLibraryNames = {
    1: "내 첫 번째 라이브러리",
    2: "소설 모음",
    3: "자기계발 서적",
    4: "역사책 컬렉션",
    5: "과학 도서",
    6: "철학 도서",
  };

  // 라이브러리 책 목록 조회
  const fetchLibraryBooks = async (page: number = 1) => {
    if (!libraryId) return;

    setIsLoading(true);
    try {
      // API 연동 시 아래 주석 해제
      // const response = await libraryService.getLibraryBooks(libraryId, page, 12);
      // setBooks(response.data.books);
      // setLibraryName(response.message.replace('"라이브러리를 성공적으로 불러왔습니다.', '')); // 응답 메시지에서 라이브러리 이름 추출
      // setTotalPages(response.data.totalPages || 1);

      // 테스트용 데이터 사용
      setBooks(mockBooks);
      // TODO: 수정해야할 것
      setLibraryName(mockLibraryNames[libraryId] || `라이브러리 ${libraryId}`);
      setTotalPages(2); // 테스트용 페이지 수
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching library books:", error);
      toast.error("책 목록 조회 실패", {
        description: "라이브러리 책 목록을 불러오는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 로드 시 책 목록 조회
  useEffect(() => {
    if (libraryId) {
      fetchLibraryBooks(1);
    }
  }, [libraryId]);

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    fetchLibraryBooks(page);
  };

  // 라이브러리 이름 수정 다이얼로그 열기
  const openEditLibraryDialog = () => {
    setEditLibraryName(libraryName);
    setOpenEditDialog(true);
  };

  // 라이브러리 이름 수정 (테스트용)
  const handleUpdateLibraryName = async () => {
    try {
      // 테스트 구현 - 실제 API 호출 대신 로컬 상태 업데이트
      // await libraryService.updateLibraryName(libraryId, editLibraryName);

      setLibraryName(editLibraryName);
      setOpenEditDialog(false);
      toast.success("라이브러리 수정 완료", {
        description: "라이브러리 이름이 수정되었습니다.",
      });
    } catch (error) {
      console.error("Error updating library:", error);
      toast.error("라이브러리 수정 실패", {
        description: "라이브러리 이름 수정 중 오류가 발생했습니다.",
      });
    }
  };

  // 책 상세 페이지로 이동
  const navigateToBookDetail = (bookId: number) => {
    navigate(`/read/${bookId}`);
  };

  // 라이브러리 목록 페이지로 돌아가기
  const navigateToLibraries = () => {
    navigate("/library");
  };

  // 로딩 상태 표시
  if (isLoading && books.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">책 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={navigateToLibraries}
          className="mb-4 pl-0"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          라이브러리 목록으로 돌아가기
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{libraryName}</h1>
          <Button
            variant="outline"
            onClick={openEditLibraryDialog}
            className="flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            이름 수정
          </Button>
        </div>
      </div>

      {/* 책 그리드 */}
      {books.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">책이 없습니다</h3>
          <p className="text-gray-600 mb-4">
            아직 이 라이브러리에 추가된 책이 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {books.map((book) => (
            <Card
              key={book.book_id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToBookDetail(book.book_id)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3]">
                  <img
                    src={book.book_image}
                    alt={book.book_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-book.png"; // 이미지 로드 실패 시 대체 이미지
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="px-3 py-2 bg-white">
                <div className="w-full">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {book.book_name}
                  </h3>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {books.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* 라이브러리 이름 수정 다이얼로그 */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>라이브러리 이름 수정</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="새 라이브러리 이름"
              value={editLibraryName}
              onChange={(e) => setEditLibraryName(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button
              onClick={handleUpdateLibraryName}
              disabled={!editLibraryName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              수정하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryDetailPage;
