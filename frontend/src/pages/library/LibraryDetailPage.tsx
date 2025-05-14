// src/pages/library/LibraryDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Book, Trash2, MoreVertical } from "lucide-react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { libraryService } from "@/utils/api/libraryService";

// 타입 정의
interface LibraryBook {
  bookId: number;
  bookName: string;
  bookImage: string | null;
  bookIsbn: string;
  bookEcn: string | null;
  bookPubDate: string;
  bookUpdateAt: string;
}

interface LibraryDetail {
  libraryId: number;
  libraryName: string;
  createdAt: string;
  updatedAt: string;
}

interface LibraryBooksResponse {
  status: number;
  message: string;
  data: {
    libraryDto: LibraryDetail;
    allLibraryBooks: LibraryBook[];
    totalCount: number;
    page: number;
    size: number;
  };
}

const LibraryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const libraryId = parseInt(id || "0");
  const navigate = useNavigate();

  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [libraryInfo, setLibraryInfo] = useState<LibraryDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editLibraryName, setEditLibraryName] = useState<string>("");
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [pageSize] = useState<number>(12); // 페이지당 표시할 책 수

  // 책 삭제 관련 상태
  const [bookToDelete, setBookToDelete] = useState<LibraryBook | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // 라이브러리 책 목록 조회
  const fetchLibraryBooks = async (page: number = 0) => {
    if (!libraryId) return;

    setIsLoading(true);
    try {
      // libraryService 사용하여 API 호출
      const response = await libraryService.getLibraryBooks(
        libraryId,
        page,
        pageSize
      );

      console.log(response);

      if (response.status === 200) {
        setBooks(response.data.allLibraryBooks);
        setLibraryInfo(response.data.libraryDto);
        setTotalCount(response.data.totalCount);

        // 총 페이지 수 계산
        const calculatedTotalPages = Math.ceil(
          response.data.totalCount / response.data.size
        );
        setTotalPages(calculatedTotalPages || 1);
        setCurrentPage(response.data.page);
      } else {
        throw new Error(
          response.message || "책 목록을 불러오는데 실패했습니다."
        );
      }
    } catch (error) {
      console.error("Error fetching library books:", error);
      toast.error("책 목록 조회 실패", {
        description: "라이브러리 책 목록을 불러오는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 라이브러리에서 책 삭제
  const handleDeleteBook = async () => {
    if (!libraryId || !bookToDelete) return;

    try {
      await libraryService.removeBookFromLibrary(
        libraryId,
        bookToDelete.bookId
      );

      setOpenDeleteDialog(false);
      setBookToDelete(null);

      toast.success("책 삭제 완료", {
        description: "라이브러리에서 책이 삭제되었습니다.",
      });

      // 페이지 완전히 새로고침하여 모든 상태 초기화
      window.location.reload();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("책 삭제 실패", {
        description: "책 삭제 중 오류가 발생했습니다.",
      });
    }
  };

  // 책 삭제 다이얼로그 열기
  const openDeleteBookDialog = (book: LibraryBook, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지 (책 상세 페이지로 이동하지 않도록)
    setBookToDelete(book);
    setOpenDeleteDialog(true);
  };

  // 페이지 로드 시 책 목록 조회
  useEffect(() => {
    if (libraryId) {
      fetchLibraryBooks(0);
    }
  }, [libraryId]);

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    fetchLibraryBooks(page);
  };

  // 라이브러리 이름 수정 다이얼로그 열기
  const openEditLibraryDialog = () => {
    if (libraryInfo) {
      setEditLibraryName(libraryInfo.libraryName);
      setOpenEditDialog(true);
    }
  };

  // 라이브러리 이름 수정
  const handleUpdateLibraryName = async () => {
    if (!libraryId) return;

    try {
      await libraryService.updateLibraryName(libraryId, editLibraryName);

      // 라이브러리 정보 업데이트
      if (libraryInfo) {
        setLibraryInfo({
          ...libraryInfo,
          libraryName: editLibraryName,
        });
      }

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

  // 기본 이미지 - 책 이미지가 없을 경우 사용할 이미지 목록
  const placeholderImages = [
    "https://placehold.co/400x600/e8eaf2/4a6fa5?text=No+Cover+Available&font=montserrat",
    "https://placehold.co/400x600/f5e6e8/9e3f3f?text=Cover+Coming+Soon&font=montserrat",
    "https://placehold.co/400x600/e8f0e6/3e733f?text=No+Image+Available&font=montserrat",
  ];

  // 책 ID를 기반으로 일관된 플레이스홀더 이미지 선택
  const getPlaceholderImage = (bookId: number) => {
    const index = bookId % placeholderImages.length;
    return placeholderImages[index];
  };

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
          <h1 className="text-xl font-bold">
            {libraryInfo?.libraryName || "라이브러리"}
          </h1>
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
              key={book.bookId}
              className="overflow-hidden relative hover:shadow-md transition-shadow"
            >
              <CardContent
                className="p-0 cursor-pointer"
                onClick={() => navigateToBookDetail(book.bookId)}
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={book.bookImage || getPlaceholderImage(book.bookId)}
                    alt={book.bookName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getPlaceholderImage(
                        book.bookId
                      );
                    }}
                  />

                  {/* 더보기 메뉴 (삭제) */}
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-white/80 hover:bg-white rounded-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onClick={(e) => openDeleteBookDialog(book, e)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
              <CardFooter
                className="px-3 py-2 bg-white cursor-pointer"
                onClick={() => navigateToBookDetail(book.bookId)}
              >
                <div className="w-full">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {book.bookName}
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

      {/* 책 삭제 확인 다이얼로그 */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>책 삭제</DialogTitle>
            <DialogDescription>
              "{bookToDelete?.bookName}"을(를) 라이브러리에서 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleDeleteBook} variant="destructive">
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryDetailPage;
