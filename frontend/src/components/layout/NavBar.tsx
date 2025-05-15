// src/components/layout/Navbar.tsx (기존 Navbar 업데이트 - 검색 기능 추가)
import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  User,
  LogIn,
  UserPlus,
  Heart,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showCategories, setShowCategories] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // 스크롤 방향에 따라 카테고리 표시/숨김 처리
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향 체크 (아래로 스크롤 시 숨기고, 위로 스크롤 시 표시)
      if (currentScrollY > lastScrollY) {
        // 아래로 스크롤 중
        setShowCategories(false);
      } else {
        // 위로 스크롤 중
        setShowCategories(true);
      }

      // 현재 스크롤 위치 저장
      setLastScrollY(currentScrollY);
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // 내 라이브러리로 이동하는 함수
  const navigateToLibrary = () => {
    navigate("/library");
  };

  // 관심 도서로 이동하는 함수
  const navigateToPreference = () => {
    navigate("/preference");
  };

  // 마이페이지로 이동하는 함수
  const navigateToMyPage = () => {
    navigate("/my-page");
  };

  // 로그아웃 함수
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 검색 처리 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // 카테고리 클릭 처리
  const handleCategoryClick = (categoryId: string) => {
    // 전체 카테고리인 경우
    if (categoryId === "000") {
      navigate("/books");
    } else {
      navigate(`/books?category=${categoryId}`);
    }
  };

  // KDC 한국십진분류법 기반 카테고리
  const categories = [
    {
      id: "000",
      name: "전체",
      subcategories: ["백과사전", "도서관학", "저널리즘", "전집", "연속간행물"],
    },
    {
      id: "100",
      name: "철학",
      subcategories: [
        "형이상학",
        "인식론",
        "논리학",
        "윤리학",
        "심리학",
        "동양철학",
        "서양철학",
      ],
    },
    {
      id: "200",
      name: "종교",
      subcategories: ["비교종교", "불교", "기독교", "천주교", "이슬람교"],
    },
    {
      id: "300",
      name: "사회과학",
      subcategories: [
        "사회학",
        "통계학",
        "경제학",
        "정치학",
        "행정학",
        "법학",
        "교육학",
      ],
    },
    {
      id: "400",
      name: "자연과학",
      subcategories: ["수학", "물리학", "화학", "천문학", "지구과학", "생물학"],
    },
    {
      id: "500",
      name: "기술과학",
      subcategories: ["의학", "농업", "공학", "건축학", "가정학", "경영학"],
    },
    {
      id: "600",
      name: "예술",
      subcategories: [
        "미술",
        "조각",
        "디자인",
        "음악",
        "영화",
        "연극",
        "스포츠",
      ],
    },
    {
      id: "700",
      name: "언어",
      subcategories: [
        "한국어",
        "중국어",
        "일본어",
        "영어",
        "독일어",
        "프랑스어",
      ],
    },
    {
      id: "800",
      name: "문학",
      subcategories: [
        "시",
        "소설",
        "희곡",
        "수필",
        "평론",
        "한국문학",
        "외국문학",
      ],
    },
    {
      id: "900",
      name: "역사",
      subcategories: [
        "아시아사",
        "유럽사",
        "아프리카사",
        "북미사",
        "남미사",
        "한국사",
        "지리",
      ],
    },
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-50">
      {/* 헤더 내용 */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between ">
        {/* 좌측: 로고 및 검색바 */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          {/* 로고 */}
          <a href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-blue-600">북스페이스</span>
          </a>
          {/* 검색바 */}
          <div className="relative flex-1 hidden sm:flex items-center">
            <form onSubmit={handleSearch} className="w-full">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="책 검색..."
                className="pl-8 pr-20 w-full h-9 rounded-lg focus:ring-2 focus:ring-blue-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 bg-blue-600 hover:bg-blue-700"
              >
                검색하기
              </Button>
            </form>
          </div>
        </div>
        {/* 우측: 로그인 상태에 따른 버튼들 */}
        <div className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            // 로그인 시 표시될 버튼들
            <>
              {/* 내 라이브러리 */}
              <Button
                variant="ghost"
                className="hidden md:flex gap-1 items-center"
                onClick={navigateToLibrary}
              >
                <BookOpen className="h-5 w-5" />
                <span>내 라이브러리</span>
              </Button>

              {/* 관심 도서 */}
              <Button
                variant="ghost"
                className="hidden md:flex gap-1 items-center"
                onClick={navigateToPreference}
              >
                <Heart className="h-5 w-5" />
                <span>관심 도서</span>
              </Button>

              {/* 마이페이지 */}
              <Button
                variant="ghost"
                className="hidden md:flex gap-1 items-center"
                onClick={navigateToMyPage}
              >
                <User className="h-5 w-5" />
                <span>마이페이지</span>
              </Button>

              {/* 로그아웃 */}
              <Button
                variant="ghost"
                className="hidden md:flex gap-1 items-center text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>로그아웃</span>
              </Button>

              {/* 모바일 전용: 아이콘만 표시 */}
              <div className="flex md:hidden">
                <Button variant="ghost" size="icon" onClick={navigateToLibrary}>
                  <BookOpen className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navigateToPreference}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={navigateToMyPage}>
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            // 비로그인 시 표시될 버튼들
            <>
              <Link to="/login">
                <Button variant="ghost" className="">
                  <LogIn className="h-5 w-5 mr-2" />
                  로그인
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="default"
                  className=" bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  회원가입
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      {/* 카테고리 메뉴 - KDC 한국십진분류법 기반 */}
      <div
        className={`container mx-auto px-4 flex gap-2 overflow-x-auto scrollbar-hide transition-all duration-300 ${
          showCategories
            ? "opacity-100 max-h-12 py-2 "
            : "opacity-0 max-h-0 overflow-hidden py-0"
        }`}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="text-sm h-8 px-3 flex items-center whitespace-nowrap"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
