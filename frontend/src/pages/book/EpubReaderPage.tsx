import React, { useState, useRef, useEffect } from "react";
import { Book } from "epubjs"; // EPUB.js 라이브러리 임포트
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  BookOpen,
  List,
  Search,
  Bookmark,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  X,
  Columns,
  BookIcon,
} from "lucide-react";

// EPUB 도서 인터페이스
interface EpubBook {
  title: string;
  author: string;
  coverUrl?: string;
  chapters: EpubChapter[];
  metadata: {
    language: string;
    publisher?: string;
    publicationDate?: string;
  };
  pages: EpubPage[]; // 페이지 기반 레이아웃을 위한 페이지 배열
}

// 챕터 인터페이스
interface EpubChapter {
  id: string;
  title: string;
  content: string;
  position: number;
}

// 페이지 인터페이스 (두 페이지 레이아웃을 위함)
interface EpubPage {
  id: string;
  chapterId: string;
  content: string;
  pageNumber: number;
}

// Mock interface for a bookmark
interface Bookmark {
  id: string;
  chapterId: string;
  position: number;
  text: string;
  createdAt: Date;
}

// 글로벌 스타일을 위한 CSS 추가
const globalStyles = `
  .epub-content h1, .epub-content h2, .epub-content h3, .epub-content h4, .epub-content h5, .epub-content h6 {
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    font-weight: bold;
    color: #1a202c;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.5rem;
  }

  .dark .epub-content h1, 
  .dark .epub-content h2, 
  .dark .epub-content h3, 
  .dark .epub-content h4, 
  .dark .epub-content h5, 
  .dark .epub-content h6 {
    color: #e2e8f0;
    border-bottom: 1px solid #4a5568;
  }

  .epub-content h1 { font-size: 1.8em; }
  .epub-content h2 { font-size: 1.5em; }
  .epub-content h3 { font-size: 1.3em; }
  .epub-content h4, .epub-content h5, .epub-content h6 { font-size: 1.2em; }

  .epub-content p {
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }

  .epub-content strong, .epub-content b {
    font-weight: bold;
  }

  .epub-content img {
    max-width: 100%;
    margin: 1rem auto;
    display: block;
  }

  .epub-content blockquote {
    border-left: 4px solid #e2e8f0;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
  }

  .dark .epub-content blockquote {
    border-left-color: #4a5568;
  }

  .epub-content table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }

  .epub-content th,
  .epub-content td {
    border: 1px solid #e2e8f0;
    padding: 0.5rem;
  }

  .dark .epub-content th,
  .dark .epub-content td {
    border-color: #4a5568;
  }

  .epub-content a {
    color: #3182ce;
    text-decoration: underline;
  }

  .dark .epub-content a {
    color: #63b3ed;
  }

  .epub-content section, .epub-content div.section {
    margin-top: 2rem;
  }
`;

const EpubReaderPage: React.FC = () => {
  // 도서 및 챕터 상태 관리
  const [book, setBook] = useState<EpubBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // 리더 설정
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>("system-ui");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    { chapterId: string; position: number; text: string }[]
  >([]);
  const [viewMode, setViewMode] = useState<"single" | "double">("single");
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  // 레퍼런스
  const contentRef = useRef<HTMLDivElement>(null);

  // 반응형 레이아웃을 위한 화면 크기 감지
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // 1024px 이상을 데스크톱으로 간주
      // 데스크톱 환경에서는 기본값으로 두 페이지 보기 설정
      setViewMode(window.innerWidth >= 1024 ? "double" : "single");
    };

    checkIfDesktop(); // 초기 실행
    window.addEventListener("resize", checkIfDesktop);

    return () => {
      window.removeEventListener("resize", checkIfDesktop);
    };
  }, []);

  // EPUB 파일 로드 및 파싱
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);

        // 지정된 EPUB 파일 경로 직접 사용
        const epubPath = "/books/hilton-morning-journey.epub";

        // EPUB 파일 불러오기
        try {
          // 파일 존재 여부 확인
          const response = await fetch(epubPath);
          if (!response.ok) {
            throw new Error(
              `EPUB 파일을 로드할 수 없습니다: ${response.status} ${response.statusText}`
            );
          }

          // EPUB.js를 사용하여 책 로드
          const book = new Book(epubPath);
          await book.ready;

          // 메타데이터 추출
          const metadata = await book.loaded.metadata;
          const title = metadata.title;
          const author = metadata.creator;

          // 목차 추출
          const navigation = await book.loaded.navigation;
          const toc = navigation.toc;

          // 챕터 및 콘텐츠 추출
          const chapters = [];
          for (let i = 0; i < toc.length; i++) {
            const item = toc[i];
            const href = item.href;

            // 챕터 내용 로드
            // EPUB.js에서 chapter 객체는 document 또는 다른 형태로 반환될 수 있음
            const chapter = await book.load(href);
            let content = "";

            // document 객체인 경우 innerHTML 접근 가능
            if (chapter.body && typeof chapter.body.innerHTML === "string") {
              content = chapter.body.innerHTML;
            }
            // 문자열인 경우 직접 사용
            else if (typeof chapter === "string") {
              content = chapter;
            }
            // documentFragment인 경우
            else if (chapter.documentElement) {
              content = chapter.documentElement.outerHTML;
            }
            // 기타 경우 대비
            else {
              const tempDiv = document.createElement("div");
              tempDiv.appendChild(chapter.cloneNode(true));
              content = tempDiv.innerHTML;
            }

            chapters.push({
              id: `chapter-${i + 1}`,
              title: item.label,
              content: content,
              position: i,
            });
          }

          // 페이지 생성
          const pages = [];
          let pageCounter = 1;

          // 챕터별로 페이지 분할
          for (const chapter of chapters) {
            // DOM을 사용하여 콘텐츠 파싱
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = chapter.content;

            const paragraphs = tempDiv.querySelectorAll("p, div");
            let currentPageContent = "";
            let currentPageSize = 0;
            const pageSize = 1000; // 페이지당 텍스트 길이 기준값

            for (let i = 0; i < paragraphs.length; i++) {
              const paraContent = paragraphs[i].outerHTML;
              currentPageContent += paraContent;
              currentPageSize += paraContent.length;

              // 페이지 크기가 기준을 초과하거나 마지막 단락이면 페이지 생성
              if (currentPageSize >= pageSize || i === paragraphs.length - 1) {
                pages.push({
                  id: `${chapter.id}-page-${pages.length + 1}`,
                  chapterId: chapter.id,
                  content: currentPageContent,
                  pageNumber: pageCounter,
                });

                pageCounter++;
                currentPageContent = "";
                currentPageSize = 0;
              }
            }

            // 챕터에 콘텐츠가 없거나 paragraphs가 없는 경우, 빈 페이지 추가
            if (
              pages.length === 0 ||
              pages[pages.length - 1].chapterId !== chapter.id
            ) {
              pages.push({
                id: `${chapter.id}-page-1`,
                chapterId: chapter.id,
                content: chapter.content,
                pageNumber: pageCounter,
              });
              pageCounter++;
            }
          }

          // 표지 이미지 URL 가져오기
          let coverUrl;
          try {
            coverUrl = await book.coverUrl();
          } catch (e) {
            console.warn("표지 이미지를 불러오는데 실패했습니다:", e);
            coverUrl = "/api/placeholder/400/600";
          }

          // 책 데이터 설정
          setBook({
            title: title || "아침의 여정",
            author: author || "조지 힐튼",
            coverUrl: coverUrl,
            chapters: chapters,
            pages: pages,
            metadata: {
              language: metadata.language || "ko",
              publisher: metadata.publisher || "",
              publicationDate: metadata.pubdate || "",
            },
          });

          console.log(`"${epubPath}" EPUB 파일을 성공적으로 로드했습니다.`);
        } catch (error) {
          console.error(`"${epubPath}" EPUB 파일 로드 중 오류:`, error);

          // 오류 발생 시 fallback으로 테스트 데이터 사용 (개발 목적으로만 사용)
          alert(
            `실제 EPUB 파일을 로드하지 못했습니다: ${error.message}\n테스트 데이터를 대신 표시합니다.`
          );

          // 테스트 데이터 - 실제 배포 전 제거 필요
          // (생략)
        }

        setLoading(false);
      } catch (error) {
        console.error("EPUB 파일을 로드하는 중 오류가 발생했습니다:", error);
        setLoading(false);
      }
    };

    loadBook();
  }, []);

  // 페이지 및 챕터 탐색 함수
  const goToNextPage = () => {
    if (book) {
      if (viewMode === "double") {
        // 두 페이지 모드에서는 한 번에 두 페이지씩 넘김
        if (currentPageIndex + 2 < book.pages.length) {
          setCurrentPageIndex(currentPageIndex + 2);
          window.scrollTo(0, 0);
        }
      } else {
        // 한 페이지 모드
        if (currentPageIndex + 1 < book.pages.length) {
          setCurrentPageIndex(currentPageIndex + 1);
          window.scrollTo(0, 0);
        }
      }
    }
  };

  const goToPreviousPage = () => {
    if (book) {
      if (viewMode === "double") {
        // 두 페이지 모드에서는 한 번에 두 페이지씩 뒤로
        if (currentPageIndex - 2 >= 0) {
          setCurrentPageIndex(currentPageIndex - 2);
          window.scrollTo(0, 0);
        }
      } else {
        // 한 페이지 모드
        if (currentPageIndex > 0) {
          setCurrentPageIndex(currentPageIndex - 1);
          window.scrollTo(0, 0);
        }
      }
    }
  };

  // 특정 챕터로 이동
  const goToChapter = (index: number) => {
    if (book && index >= 0 && index < book.chapters.length) {
      // 해당 챕터의 첫 페이지 찾기
      const firstPageOfChapter = book.pages.findIndex(
        (page) => page.chapterId === book.chapters[index].id
      );

      if (firstPageOfChapter !== -1) {
        setCurrentPageIndex(firstPageOfChapter);
        setCurrentChapterIndex(index);
        window.scrollTo(0, 0);
        setShowSidebar(false);
      }
    }
  };

  // 보기 모드 전환 (한 페이지/두 페이지)
  const toggleViewMode = () => {
    const newMode = viewMode === "single" ? "double" : "single";
    setViewMode(newMode);

    // 두 페이지 모드로 전환할 때 짝수 페이지로 맞추기
    if (newMode === "double" && currentPageIndex % 2 !== 0) {
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    }
  };

  // 북마크 관련 함수
  const addBookmark = () => {
    if (!book) return;

    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") return;

    // 현재 페이지의 챕터 ID 찾기
    const currentPage = book.pages[currentPageIndex];

    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      chapterId: currentPage.chapterId,
      position: currentPageIndex, // 페이지 인덱스 저장
      text:
        selection.toString().slice(0, 100) +
        (selection.toString().length > 100 ? "..." : ""),
      createdAt: new Date(),
    };

    setBookmarks([...bookmarks, newBookmark]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  const goToBookmark = (bookmark: Bookmark) => {
    if (!book) return;

    // 북마크의 위치(페이지 인덱스)로 이동
    setCurrentPageIndex(bookmark.position);

    // 해당 챕터 인덱스 찾기
    const chapterIndex = book.chapters.findIndex(
      (chapter) => chapter.id === bookmark.chapterId
    );
    if (chapterIndex !== -1) {
      setCurrentChapterIndex(chapterIndex);
    }

    window.scrollTo(0, 0);
    setShowSidebar(false);
  };

  // 검색 기능
  const performSearch = () => {
    if (!book || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results: { chapterId: string; position: number; text: string }[] = [];

    // 페이지 단위로 검색 (챕터가 아닌)
    book.pages.forEach((page, pageIndex) => {
      const content = page.content.toLowerCase();
      const query = searchQuery.toLowerCase();

      let position = content.indexOf(query);
      while (position !== -1) {
        // 매치된 텍스트 주변의 스니펫 가져오기
        const startPos = Math.max(0, position - 30);
        const endPos = Math.min(content.length, position + query.length + 30);
        const snippet = content.slice(startPos, endPos);

        results.push({
          chapterId: page.chapterId,
          position: pageIndex, // 페이지 인덱스 저장
          text: `...${snippet}...`,
        });

        position = content.indexOf(query, position + 1);
      }
    });

    setSearchResults(results);
  };

  const goToSearchResult = (result: {
    chapterId: string;
    position: number;
  }) => {
    // 검색 결과의 위치(페이지 인덱스)로 이동
    setCurrentPageIndex(result.position);

    // 해당 챕터 인덱스 찾기
    const chapterIndex =
      book?.chapters.findIndex((chapter) => chapter.id === result.chapterId) ||
      0;
    if (chapterIndex !== -1) {
      setCurrentChapterIndex(chapterIndex);
    }

    window.scrollTo(0, 0);
    setShowSidebar(false);
  };

  // 테마 전환
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // 로딩 상태 화면
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>EPUB 책을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 책이 없을 때 화면
  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">불러온 책이 없습니다</h1>
          <p className="mb-4">EPUB 파일을 업로드하여 읽기를 시작하세요.</p>
          <Button>EPUB 업로드</Button>
        </div>
      </div>
    );
  }

  // 현재 페이지 및 챕터 정보
  const currentChapter = book.chapters[currentChapterIndex];
  const currentPage = book.pages[currentPageIndex];
  // 두 페이지 모드일 때 두 번째 페이지 (없을 수도 있음)
  const nextPage = book.pages[currentPageIndex + 1];

  return (
    <div
      className={`flex h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      {/* 글로벌 스타일 추가 */}
      <style>{globalStyles}</style>
      {showSidebar && (
        <div
          className={`w-64 h-full flex-shrink-0 border-r ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          } overflow-y-auto`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{book.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(false)}
              >
                <X size={18} />
              </Button>
            </div>

            <p className="text-sm mb-4">{book.author}</p>

            {book.coverUrl && (
              <div className="mb-4">
                <img
                  src={book.coverUrl}
                  alt={`${book.title}의 표지`}
                  className="w-full rounded-md shadow-md"
                />
              </div>
            )}

            <Tabs defaultValue="contents">
              <TabsList className="w-full">
                <TabsTrigger value="contents" className="w-1/3">
                  목차
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="w-1/3">
                  북마크
                </TabsTrigger>
                <TabsTrigger value="search" className="w-1/3">
                  검색
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contents" className="mt-4">
                <div className="space-y-2">
                  {/* 챕터 목록 */}
                  {book.chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      className={`p-2 rounded cursor-pointer text-sm ${
                        index === currentChapterIndex
                          ? theme === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-200"
                          : theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => goToChapter(index)}
                    >
                      {chapter.title}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bookmarks" className="mt-4">
                {bookmarks.length === 0 ? (
                  <p className="text-sm text-gray-500">북마크가 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className={`p-3 rounded border ${
                          theme === "dark"
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            {book.chapters.find(
                              (ch) => ch.id === bookmark.chapterId
                            )?.title || "알 수 없는 챕터"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBookmark(bookmark.id)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        <p className="text-sm mb-2 line-clamp-2">
                          {bookmark.text}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => goToBookmark(bookmark)}
                        >
                          북마크로 이동
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="search" className="mt-4">
                <div className="space-y-3">
                  <div className="flex">
                    <Input
                      placeholder="책 내용 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button className="ml-2" onClick={performSearch}>
                      <Search size={16} />
                    </Button>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="space-y-3 mt-4">
                      <p className="text-sm text-gray-500">
                        {searchResults.length}개의 결과를 찾았습니다
                      </p>
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded border ${
                            theme === "dark"
                              ? "border-gray-700"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="text-xs text-gray-500 mb-1">
                            {book.chapters.find(
                              (ch) => ch.id === result.chapterId
                            )?.title || "알 수 없는 챕터"}
                          </div>
                          <p
                            className="text-sm mb-2"
                            dangerouslySetInnerHTML={{
                              __html: result.text.replace(
                                new RegExp(searchQuery, "gi"),
                                (match) =>
                                  `<mark class="${
                                    theme === "dark"
                                      ? "bg-yellow-600"
                                      : "bg-yellow-200"
                                  } text-current">${match}</mark>`
                              ),
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => goToSearchResult(result)}
                          >
                            결과로 이동
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <p className="text-sm text-gray-500 mt-4">
                      검색 결과가 없습니다.
                    </p>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 상단 네비게이션 바 */}
        <div
          className={`p-2 border-b flex justify-between items-center ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <List size={20} />
            </Button>

            <span className="ml-4 text-sm truncate max-w-[150px]">
              {currentChapter.title}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <TooltipProvider>
              {/* 보기 모드 전환 버튼 (데스크톱에서만 활성화) */}
              {isDesktop && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleViewMode}
                    >
                      {viewMode === "single" ? (
                        <BookIcon size={20} />
                      ) : (
                        <Columns size={20} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {viewMode === "single"
                        ? "두 페이지 보기"
                        : "한 페이지 보기"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={addBookmark}>
                    <Bookmark size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>북마크 추가</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>테마 변경</p>
                </TooltipContent>
              </Tooltip>

              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings size={20} />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>설정</p>
                  </TooltipContent>
                </Tooltip>

                <DialogContent
                  className={
                    theme === "dark" ? "bg-gray-800 text-gray-100" : ""
                  }
                >
                  <DialogHeader>
                    <DialogTitle>리더 설정</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">글꼴 크기</label>
                      <div className="flex items-center space-x-4">
                        <ZoomOut size={16} />
                        <Slider
                          value={[fontSize]}
                          min={12}
                          max={24}
                          step={1}
                          onValueChange={(values) => setFontSize(values[0])}
                          className="flex-1"
                        />
                        <ZoomIn size={16} />
                      </div>
                      <span className="text-xs text-gray-500">
                        {fontSize}px
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">글꼴 종류</label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            theme === "dark" ? "bg-gray-800 text-gray-100" : ""
                          }
                        >
                          <SelectItem value="system-ui">시스템 기본</SelectItem>
                          <SelectItem value="serif">명조체</SelectItem>
                          <SelectItem value="sans-serif">고딕체</SelectItem>
                          <SelectItem value="monospace">고정폭</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isDesktop && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          페이지 보기 모드
                        </label>
                        <Select
                          value={viewMode}
                          onValueChange={(value: "single" | "double") =>
                            setViewMode(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className={
                              theme === "dark"
                                ? "bg-gray-800 text-gray-100"
                                : ""
                            }
                          >
                            <SelectItem value="single">한 페이지</SelectItem>
                            <SelectItem value="double">두 페이지</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </TooltipProvider>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div
          ref={contentRef}
          className={`flex-1 overflow-y-auto py-8 ${
            viewMode === "double" && isDesktop
              ? "flex justify-center gap-8 px-4"
              : "px-4 sm:px-8 md:px-16 lg:px-20"
          }`}
        >
          {viewMode === "double" && isDesktop ? (
            <>
              {/* 두 페이지 모드 (데스크톱) */}
              <div
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } border p-8 shadow-md flex-1 w-full`}
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily,
                  lineHeight: "1.6",
                }}
              >
                <div
                  className="epub-content"
                  dangerouslySetInnerHTML={{ __html: currentPage.content }}
                />
              </div>

              {/* 두 번째 페이지 (있을 경우에만 표시) */}
              {nextPage && (
                <div
                  className={`${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } border p-8 shadow-md flex-1 w-full`}
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily,
                    lineHeight: "1.6",
                  }}
                >
                  <div
                    className="epub-content"
                    dangerouslySetInnerHTML={{ __html: nextPage.content }}
                  />
                </div>
              )}
            </>
          ) : (
            // 한 페이지 모드
            <div
              className="max-w-prose mx-auto w-full"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily,
                lineHeight: "1.6",
              }}
            >
              <div
                className="epub-content"
                dangerouslySetInnerHTML={{ __html: currentPage.content }}
              />
            </div>
          )}
        </div>

        {/* 하단 네비게이션 */}
        <div
          className={`p-3 border-t flex justify-between ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <Button
            variant="outline"
            disabled={currentPageIndex === 0}
            onClick={goToPreviousPage}
          >
            <ChevronLeft size={16} className="mr-2" />
            이전
          </Button>

          <div className="text-sm">
            {/* 페이지 번호 표시 */}
            {currentPage.pageNumber}
            {viewMode === "double" && nextPage && ` - ${nextPage.pageNumber}`}/{" "}
            {book.pages.length}
          </div>

          <Button
            variant="outline"
            disabled={
              viewMode === "double"
                ? currentPageIndex + 2 >= book.pages.length
                : currentPageIndex + 1 >= book.pages.length
            }
            onClick={goToNextPage}
          >
            다음
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EpubReaderPage;
