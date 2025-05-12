import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  BookIcon,
  LogOutIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  UploadIcon,
  SaveIcon,
} from "lucide-react";

// 테스트용 데이터
const mockBooks = [
  {
    id: "1",
    title: "리액트 마스터하기",
    author: "김개발",
    publisher: "테크북스",
    isbn: "9788901234567",
    category: "프로그래밍",
    publishedDate: "2024-03-15",
    description: "리액트의 기초부터 고급 개념까지 모두 다루는 완벽 가이드",
    coverImageUrl: "https://via.placeholder.com/150x200",
  },
  {
    id: "2",
    title: "타입스크립트 실전 가이드",
    author: "이코딩",
    publisher: "코딩출판사",
    isbn: "9788901234568",
    category: "프로그래밍",
    publishedDate: "2024-02-20",
    description: "타입스크립트를 활용한 실제 프로젝트 개발 방법",
    coverImageUrl: "https://via.placeholder.com/150x200",
  },
  {
    id: "3",
    title: "Next.js로 배우는 서버 사이드 렌더링",
    author: "박프론트",
    publisher: "웹북스",
    isbn: "9788901234569",
    category: "웹개발",
    publishedDate: "2024-04-05",
    description: "Next.js 프레임워크를 활용한 SSR 애플리케이션 개발",
    coverImageUrl: "https://via.placeholder.com/150x200",
  },
  {
    id: "4",
    title: "자바스크립트 디자인 패턴",
    author: "최패턴",
    publisher: "코드북스",
    isbn: "9788901234570",
    category: "프로그래밍",
    publishedDate: "2024-01-10",
    description: "현대 자바스크립트에 적용 가능한 다양한 디자인 패턴 소개",
    coverImageUrl: "https://via.placeholder.com/150x200",
  },
  {
    id: "5",
    title: "웹 개발자를 위한 UI/UX 디자인",
    author: "홍디자인",
    publisher: "디자인출판",
    isbn: "9788901234571",
    category: "디자인",
    publishedDate: "2024-05-01",
    description: "개발자 관점에서 접근하는 실용적인 UI/UX 디자인 가이드",
    coverImageUrl: "https://via.placeholder.com/150x200",
  },
  {
    id: "6",
    title: "모던 자바스크립트 완벽 가이드",
    author: "정자바",
    publisher: "테크북스",
    isbn: "9788901234572",
    category: "프로그래밍",
    publishedDate: "2023-11-15",
    description: "ES6+ 문법과 최신 자바스크립트 기술 총정리",
    coverImageUrl: "https://via.placeholder.com/150x200",
  },
];

const categories = [
  { id: "1", name: "프로그래밍" },
  { id: "2", name: "웹개발" },
  { id: "3", name: "디자인" },
  { id: "4", name: "인공지능" },
  { id: "5", name: "블록체인" },
];

const publishers = [
  { id: "1", name: "테크북스" },
  { id: "2", name: "코딩출판사" },
  { id: "3", name: "웹북스" },
  { id: "4", name: "코드북스" },
  { id: "5", name: "디자인출판" },
  { id: "6", name: "AI출판사" },
  { id: "7", name: "미래기술출판" },
];

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 반환
};

// 도서 폼 인터페이스
interface BookFormData {
  id?: string;
  title: string;
  author: string;
  publisherId: string;
  categoryId: string;
  description: string;
  isbn: string;
  ecn: string;
  publishedDate: Date | undefined;
  coverImage: File | null;
  epubFile: File | null;
  coverImageUrl?: string;
}

// 초기 빈 폼 데이터
const emptyBookForm: BookFormData = {
  title: "",
  author: "",
  publisherId: "",
  categoryId: "",
  description: "",
  isbn: "",
  ecn: "",
  publishedDate: undefined,
  coverImage: null,
  epubFile: null,
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("booksList");
  const [books, setBooks] = useState(mockBooks);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [bookForm, setBookForm] = useState<BookFormData>(emptyBookForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  useEffect(() => {
    // 실제 환경에서는 API 호출
    // 테스트 환경에서는 타이머로 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  // 도서 검색 및 필터링
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "전체" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 도서 편집 시작
  const handleEditBook = (bookId: string) => {
    const bookToEdit = books.find((book) => book.id === bookId);
    if (bookToEdit) {
      const publisherId =
        publishers.find((p) => p.name === bookToEdit.publisher)?.id || "";
      const categoryId =
        categories.find((c) => c.name === bookToEdit.category)?.id || "";

      setBookForm({
        id: bookToEdit.id,
        title: bookToEdit.title,
        author: bookToEdit.author,
        publisherId,
        categoryId,
        description: bookToEdit.description,
        isbn: bookToEdit.isbn,
        ecn: "",
        publishedDate: bookToEdit.publishedDate
          ? new Date(bookToEdit.publishedDate)
          : undefined,
        coverImage: null,
        epubFile: null,
        coverImageUrl: bookToEdit.coverImageUrl,
      });

      setCoverPreview(bookToEdit.coverImageUrl);
      setEditingBookId(bookId);
      setActiveTab("addBook");
    }
  };

  // 새 도서 추가 시작
  const handleAddNewBook = () => {
    setBookForm(emptyBookForm);
    setCoverPreview(null);
    setEditingBookId(null);
    setActiveTab("addBook");
  };

  // 도서 삭제 확인 창 열기
  const handleDeleteClick = (bookId: string) => {
    setBookToDelete(bookId);
    setDeleteDialogOpen(true);
  };

  // 도서 삭제 확인
  const confirmDelete = () => {
    if (bookToDelete) {
      // 실제 환경에서는 API 호출
      // 테스트 환경에서는 클라이언트 측 상태 업데이트
      setBooks(books.filter((book) => book.id !== bookToDelete));
      setDeleteDialogOpen(false);
      setBookToDelete(null);

      toast.success("도서가 성공적으로 삭제되었습니다.");
    }
  };

  // 폼 입력 처리 - 텍스트 필드
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 입력 처리 - 선택 필드
  const handleSelectChange = (name: string, value: string) => {
    setBookForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 입력 처리 - 날짜 필드
  const handleDateChange = (date: Date | undefined) => {
    setBookForm((prev) => ({
      ...prev,
      publishedDate: date,
    }));
  };

  // 표지 이미지 업로드 처리
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBookForm((prev) => ({
      ...prev,
      coverImage: file,
    }));

    // 이미지 미리보기 생성
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // 편집 중이고 기존 이미지가 있는 경우
      if (editingBookId && bookForm.coverImageUrl) {
        setCoverPreview(bookForm.coverImageUrl);
      } else {
        setCoverPreview(null);
      }
    }
  };

  // EPUB 파일 업로드 처리
  const handleEpubFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBookForm((prev) => ({
      ...prev,
      epubFile: file,
    }));
  };

  // 도서 폼 제출 처리
  const handleBookFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 필수 필드 검증
      if (
        !bookForm.title ||
        !bookForm.author ||
        !bookForm.publisherId ||
        !bookForm.categoryId ||
        !bookForm.isbn
      ) {
        toast.error("필수 입력 항목을 모두 입력해주세요.");
        setIsSubmitting(false);
        return;
      }

      // 실제 환경에서는 서버에 API 요청
      // 테스트 환경에서는 타이머로 지연 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingBookId) {
        // 도서 수정 로직
        const updatedBooks = books.map((book) => {
          if (book.id === editingBookId) {
            const publisher =
              publishers.find((p) => p.id === bookForm.publisherId)?.name || "";
            const category =
              categories.find((c) => c.id === bookForm.categoryId)?.name || "";

            return {
              ...book,
              title: bookForm.title,
              author: bookForm.author,
              publisher,
              category,
              isbn: bookForm.isbn,
              publishedDate: bookForm.publishedDate
                ? formatDate(bookForm.publishedDate)
                : "",
              description: bookForm.description,
              // 실제 환경에서는 업로드된 이미지 URL 업데이트
              coverImageUrl: coverPreview || book.coverImageUrl,
            };
          }
          return book;
        });

        setBooks(updatedBooks);
        toast("도서 정보가 성공적으로 수정되었습니다.");
      } else {
        // 도서 추가 로직
        const publisher =
          publishers.find((p) => p.id === bookForm.publisherId)?.name || "";
        const category =
          categories.find((c) => c.id === bookForm.categoryId)?.name || "";

        const newBook = {
          id: String(books.length + 1),
          title: bookForm.title,
          author: bookForm.author,
          publisher,
          category,
          isbn: bookForm.isbn,
          publishedDate: bookForm.publishedDate
            ? formatDate(bookForm.publishedDate)
            : "",
          description: bookForm.description,
          coverImageUrl: coverPreview || "https://via.placeholder.com/150x200",
        };

        setBooks([...books, newBook]);
        toast("새 도서가 성공적으로 추가되었습니다.");
      }

      // 도서 목록 탭으로 이동
      setActiveTab("booksList");
      setEditingBookId(null);
      setBookForm(emptyBookForm);
      setCoverPreview(null);
    } catch (error) {
      console.error("Error submitting book form:", error);
      toast.error("도서 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 도서 폼 취소 처리
  const handleCancelForm = () => {
    setActiveTab("booksList");
    setEditingBookId(null);
    setBookForm(emptyBookForm);
    setCoverPreview(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen ">
      {/* 헤더 */}
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BookIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold">도서 관리 시스템</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600 mr-2">
              {admin?.name || "관리자"} ({admin?.email || ""})
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 container mx-auto pt-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="booksList">도서 목록</TabsTrigger>
            <TabsTrigger value="addBook">도서 추가</TabsTrigger>
          </TabsList>

          {/* 도서 추가 및 편집 탭 */}
          <TabsContent value="addBook" className="space-y-6">
            <div className="flex justify-between items-cen">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {editingBookId ? "도서 정보 수정" : "새 도서 추가"}
                </h2>
                <p className="text-gray-500">
                  {editingBookId
                    ? "기존 도서 정보를 수정합니다."
                    : "새로운 도서 정보를 입력하여 추가합니다."}
                </p>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" />
                      {editingBookId ? "도서 수정" : "도서 저장"}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <form onSubmit={handleBookFormSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 이미지 및 파일 업로드 섹션 */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>도서 이미지 및 파일</CardTitle>
                    <CardDescription>
                      책 표지 이미지와 EPUB 파일을 업로드합니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 표지 이미지 업로드 */}
                    <div className="space-y-3">
                      <Label htmlFor="coverImage">표지 이미지 (필수)</Label>
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer",
                          coverPreview
                            ? "border-transparent"
                            : "border-gray-300"
                        )}
                        onClick={() =>
                          document.getElementById("coverImage")?.click()
                        }
                      >
                        {coverPreview ? (
                          <div className="relative">
                            <img
                              src={coverPreview}
                              alt="Preview"
                              className="max-h-64 mx-auto rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCoverPreview(null);
                                setBookForm((prev) => ({
                                  ...prev,
                                  coverImage: null,
                                  coverImageUrl: undefined,
                                }));
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="py-6">
                            <UploadIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              클릭하여 표지 이미지 업로드
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              JPG, PNG 파일 (최대 5MB)
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="coverImage"
                          name="coverImage"
                          accept="image/jpeg, image/png"
                          className="hidden"
                          onChange={handleCoverImageChange}
                        />
                      </div>
                    </div>

                    {/* EPUB 파일 업로드 */}
                    <div className="space-y-3">
                      <Label htmlFor="epubFile">EPUB 파일 (필수)</Label>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer"
                        onClick={() =>
                          document.getElementById("epubFile")?.click()
                        }
                      >
                        <div className="py-6">
                          <BookIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            클릭하여 EPUB 파일 업로드
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            EPUB 파일 (최대 50MB)
                          </p>
                        </div>
                        {bookForm.epubFile && (
                          <div className="mt-2 p-2 bg-gray-100 rounded-md flex items-center justify-between">
                            <div className="text-sm truncate">
                              {bookForm.epubFile.name}
                            </div>
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookForm((prev) => ({
                                  ...prev,
                                  epubFile: null,
                                }));
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          id="epubFile"
                          name="epubFile"
                          accept=".epub"
                          className="hidden"
                          onChange={handleEpubFileChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 도서 기본 정보 섹션 */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>도서 기본 정보</CardTitle>
                    <CardDescription>
                      도서의 기본 정보를 입력합니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 도서명 */}
                    <div className="space-y-2">
                      <Label htmlFor="title">도서명 (필수)</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="도서명을 입력하세요"
                        value={bookForm.title}
                        onChange={handleTextChange}
                        required
                      />
                    </div>

                    {/* 저자 */}
                    <div className="space-y-2">
                      <Label htmlFor="author">저자 (필수)</Label>
                      <Input
                        id="author"
                        name="author"
                        placeholder="저자명을 입력하세요"
                        value={bookForm.author}
                        onChange={handleTextChange}
                        required
                      />
                    </div>

                    {/* 출판사 및 카테고리 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="publisherId">출판사 (필수)</Label>
                        <Select
                          value={bookForm.publisherId}
                          onValueChange={(value) =>
                            handleSelectChange("publisherId", value)
                          }
                        >
                          <SelectTrigger id="publisherId">
                            <SelectValue placeholder="출판사 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {publishers.map((publisher) => (
                              <SelectItem
                                key={publisher.id}
                                value={publisher.id}
                              >
                                {publisher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="categoryId">카테고리 (필수)</Label>
                        <Select
                          value={bookForm.categoryId}
                          onValueChange={(value) =>
                            handleSelectChange("categoryId", value)
                          }
                        >
                          <SelectTrigger id="categoryId">
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* ISBN 및 ECN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="isbn">ISBN (필수)</Label>
                        <Input
                          id="isbn"
                          name="isbn"
                          placeholder="ISBN 번호 (예: 9788901234567)"
                          value={bookForm.isbn}
                          onChange={handleTextChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ecn">ECN (선택)</Label>
                        <Input
                          id="ecn"
                          name="ecn"
                          placeholder="ECN 번호 (있는 경우)"
                          value={bookForm.ecn}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>

                    {/* 출판일 */}
                    <div className="space-y-2">
                      <Label htmlFor="publishedDate">출판일 (필수)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !bookForm.publishedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookForm.publishedDate ? (
                              formatDate(bookForm.publishedDate)
                            ) : (
                              <span>출판일 선택</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={bookForm.publishedDate}
                            onSelect={handleDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* 책 설명 */}
                    <div className="space-y-2">
                      <Label htmlFor="description">도서 설명</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="도서 설명을 입력하세요"
                        value={bookForm.description}
                        onChange={handleTextChange}
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
          </TabsContent>

          {/* 도서 목록 탭 */}
          <TabsContent value="booksList" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold ">도서 목록 관리</h2>
            </div>

            <Card>
              <CardContent className="px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>도서명</TableHead>
                      <TableHead>저자</TableHead>
                      <TableHead>출판사</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead>출판일</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-6 text-gray-500"
                        >
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">
                            {book.title}
                          </TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>{book.publisher}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {book.category}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {book.isbn}
                          </TableCell>
                          <TableCell>{book.publishedDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBook(book.id)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleDeleteClick(book.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 도서 삭제 확인 다이얼로그 */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>도서 삭제 확인</DialogTitle>
                  <DialogDescription>
                    정말로 이 도서를 삭제하시겠습니까? 이 작업은 되돌릴 수
                    없습니다.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
