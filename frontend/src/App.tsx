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
import { ToastProvider } from "./components/ui/use-toast";
import MyPage from "./pages/member/MyPage";
import WishlistPage from "./pages/member/WishlistPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/read/:id" element={<EpubReaderPage />} />
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
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
