// src/pages/library/LibraryPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { libraryService, Library } from "@/utils/api/libraryService";

const LibraryPage: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [newLibraryName, setNewLibraryName] = useState<string>("");
  const [editLibraryName, setEditLibraryName] = useState<string>("");
  const [editLibraryId, setEditLibraryId] = useState<number | null>(null);
  const [deleteLibraryId, setDeleteLibraryId] = useState<number | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 테스트용 데이터
  const mockLibraries = [
    {
      library_id: 1,
      library_name: "내 첫 번째 라이브러리",
      created_at: "2025-05-07T15:00:00",
      updated_at: "2025-05-07T15:00:00",
    },
    {
      library_id: 2,
      library_name: "소설 모음",
      created_at: "2025-05-06T10:30:00",
      updated_at: "2025-05-06T10:30:00",
    },
    {
      library_id: 3,
      library_name: "자기계발 서적",
      created_at: "2025-05-05T12:15:00",
      updated_at: "2025-05-05T12:15:00",
    },
    {
      library_id: 4,
      library_name: "역사책 컬렉션",
      created_at: "2025-05-03T09:45:00",
      updated_at: "2025-05-07T16:20:00",
    },
    {
      library_id: 5,
      library_name: "과학 도서",
      created_at: "2025-04-28T14:10:00",
      updated_at: "2025-04-28T14:10:00",
    },
    {
      library_id: 6,
      library_name: "철학 도서",
      created_at: "2025-04-20T11:05:00",
      updated_at: "2025-04-25T17:30:00",
    },
  ];

  // 라이브러리 목록 조회
  const fetchLibraries = async (page: number = 1) => {
    setIsLoading(true);
    try {
      // API 연동 시 아래 주석 해제
      // const response = await libraryService.getLibraries(page, 6);
      // setLibraries(response.data.libraries);
      // setTotalPages(response.data.totalPages || 1);

      // 테스트용 데이터 사용
      setLibraries(mockLibraries);
      setTotalPages(2); // 테스트용 페이지 수
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching libraries:", error);
      toast.error("라이브러리 목록 조회 실패", {
        description: "라이브러리 목록을 불러오는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 로드 시 라이브러리 목록 조회 (테스트 목적으로 isAuthenticated 검사 제거)
  useEffect(() => {
    // 실제 구현 시 아래 주석 해제
    // if (isAuthenticated) {
    fetchLibraries(1);
    // }
  }, []);

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    fetchLibraries(page);
  };

  // 라이브러리 상세 페이지로 이동
  const navigateToLibraryDetail = (libraryId: number) => {
    navigate(`/library/${libraryId}`);
  };

  // 라이브러리 생성
  const handleCreateLibrary = async () => {
    try {
      await libraryService.createLibrary(newLibraryName);
      setOpenCreateDialog(false);
      setNewLibraryName("");
      toast.success("라이브러리 생성 완료", {
        description: "새로운 라이브러리가 생성되었습니다.",
      });
      fetchLibraries(currentPage);
    } catch (error) {
      console.error("Error creating library:", error);
      toast.error("라이브러리 생성 실패", {
        description: "라이브러리 생성 중 오류가 발생했습니다.",
      });
    }
  };

  // 라이브러리 수정 다이얼로그 열기
  const openEditLibraryDialog = (library: Library) => {
    setEditLibraryId(library.library_id);
    setEditLibraryName(library.library_name);
    setOpenEditDialog(true);
  };

  // 라이브러리 이름 수정
  const handleUpdateLibraryName = async () => {
    if (!editLibraryId) return;

    try {
      await libraryService.updateLibraryName(editLibraryId, editLibraryName);
      setOpenEditDialog(false);
      toast.success("라이브러리 수정 완료", {
        description: "라이브러리 이름이 수정되었습니다.",
      });
      fetchLibraries(currentPage);
    } catch (error) {
      console.error("Error updating library:", error);
      toast.error("라이브러리 수정 실패", {
        description: "라이브러리 이름 수정 중 오류가 발생했습니다.",
      });
    }
  };

  // 라이브러리 삭제 다이얼로그 열기
  const openDeleteLibraryDialog = (libraryId: number) => {
    setDeleteLibraryId(libraryId);
    setOpenDeleteDialog(true);
  };

  // 라이브러리 삭제
  const handleDeleteLibrary = async () => {
    if (!deleteLibraryId) return;

    try {
      await libraryService.deleteLibrary(deleteLibraryId);
      setOpenDeleteDialog(false);
      toast.success("라이브러리 삭제 완료", {
        description: "라이브러리가 삭제되었습니다.",
      });
      fetchLibraries(currentPage);
    } catch (error) {
      console.error("Error deleting library:", error);
      toast.error("라이브러리 삭제 실패", {
        description: "라이브러리 삭제 중 오류가 발생했습니다.",
      });
    }
  };

  // 로딩 상태 표시
  if (isLoading && libraries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">라이브러리를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">내 라이브러리</h1>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              라이브러리 생성
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 라이브러리 생성</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input
                placeholder="라이브러리 이름"
                value={newLibraryName}
                onChange={(e) => setNewLibraryName(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button
                onClick={handleCreateLibrary}
                disabled={!newLibraryName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                생성하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 라이브러리 그리드 */}
      {libraries.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">라이브러리가 없습니다</h3>
          <p className="text-gray-600 mb-4">
            새로운 라이브러리를 생성하여 책을 관리해보세요.
          </p>
          <Button
            onClick={() => setOpenCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            라이브러리 생성
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {libraries.map((library) => (
            <Card key={library.library_id} className="flex flex-col">
              <CardHeader className="pb-2 flex justify-between items-center">
                <CardTitle
                  className=" font-medium cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigateToLibraryDetail(library.library_id)}
                >
                  {library.library_name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditLibraryDialog(library)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteLibraryDialog(library.library_id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent
                className="flex-grow cursor-pointer pb-2"
                onClick={() => navigateToLibraryDetail(library.library_id)}
              >
                <div className="bg-blue-50 rounded-lg flex items-center justify-center h-48">
                  <BookOpen className="h-16 w-16 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {libraries.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* 수정 다이얼로그 */}
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

      {/* 삭제 다이얼로그 */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>라이브러리 삭제</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>
              정말로 이 라이브러리를 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </p>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleDeleteLibrary} variant="destructive">
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryPage;
