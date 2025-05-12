import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/member/LoginPage";
import SignupPage from "./pages/member/SignupPage";
import { AuthProvider } from "./contexts/AuthContext";
import BookDetailPage from "./pages/book/BookDetailPage";
import BookReviewsPage from "./pages/book/BookReviewsPage";
import EpubReaderPage from "./pages/book/EpubReaderPage";
import LibraryPage from "./pages/library/LibraryPage";
import LibraryDetailPage from "./pages/library/LibraryDetailPage";
import { Toaster } from "sonner"; // sonner로 변경
import MyPage from "./pages/member/MyPage";
import WishlistPage from "./pages/member/WishlistPage";

// 관리자 페이지 및 인증 관련 컴포넌트
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* 관리자 라우트 */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* EPUB 리더 (전체 화면) */}
            <Route path="/read/:id" element={<EpubReaderPage />} />

            {/* 일반 사용자 라우트 (Layout 포함) */}
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/book/:id" element={<BookDetailPage />} />
                    <Route
                      path="/book/:id/reviews"
                      element={<BookReviewsPage />}
                    />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route
                      path="/library/:id"
                      element={<LibraryDetailPage />}
                    />
                    <Route path="/my-page" element={<MyPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
