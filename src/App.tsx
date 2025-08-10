
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import ShoppingPage from "./pages/ShoppingPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ChallengesPage from "./pages/ChallengesPage";
import WishlistPage from "./pages/WishlistPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import TrendlyPayPage from "./pages/TrendlyPayPage";
import TrendlyTokensPage from "./pages/TrendlyTokensPage";
import { AuthProvider } from "./hooks/useAuth";
import { SupabaseTrendlyProvider } from "./context/SupabaseTrendlyContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ChallengesProvider } from "./context/ChallengesContext";
import { TSTProvider } from "./context/TSTContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SupabaseTrendlyProvider>
          <ChallengesProvider>
            <TSTProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/" element={<Layout />}>
                      <Route index element={
                        <ProtectedRoute>
                          <HomePage />
                        </ProtectedRoute>
                      } />
                      <Route path="post" element={
                        <ProtectedRoute>
                          <PostPage />
                        </ProtectedRoute>
                      } />
                      <Route path="shop" element={
                        <ProtectedRoute>
                          <ShoppingPage />
                        </ProtectedRoute>
                      } />
                      <Route path="profile" element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="product/:id" element={
                        <ProtectedRoute>
                          <ProductDetailPage />
                        </ProtectedRoute>
                      } />
                      <Route path="leaderboard" element={
                        <ProtectedRoute>
                          <LeaderboardPage />
                        </ProtectedRoute>
                      } />
                      <Route path="checkout" element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } />
                      <Route path="search" element={
                        <ProtectedRoute>
                          <SearchResultsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="challenges" element={
                        <ProtectedRoute>
                          <ChallengesPage />
                        </ProtectedRoute>
                      } />
                      <Route path="wishlist" element={
                        <ProtectedRoute>
                          <WishlistPage />
                        </ProtectedRoute>
                      } />
                      <Route path="trendly-pay" element={
                        <ProtectedRoute>
                          <TrendlyPayPage />
                        </ProtectedRoute>
                      } />
                      <Route path="trendly-tokens" element={
                        <ProtectedRoute>
                          <TrendlyTokensPage />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </TSTProvider>
          </ChallengesProvider>
        </SupabaseTrendlyProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
