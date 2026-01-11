import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LikesProvider } from './context/LikesContext';
import { WatchListProvider } from './context/WatchListContext';
import { CollectionsProvider } from './context/CollectionsContext';
import { ThemeProvider } from './context/ThemeContext';
import { RecentlyWatchedProvider } from './context/RecentlyWatchedContext';
import { SearchHistoryProvider } from './context/SearchHistoryContext';
import { UserRatingsProvider } from './context/UserRatingsContext';
import NewNavbar from './components/NewNavbar/NewNavbar';
import NewHome from './pages/NewHome/NewHome';
import LikedPage from './pages/LikedPage/LikedPage';
import WatchListPage from './pages/WatchListPage/WatchListPage';
import RecommendationsPage from './pages/RecommendationsPage/RecommendationsPage';
import ContentDetails from './pages/ContentDetails';
import Search from './pages/Search/Search';
import CollectionsPage from './pages/CollectionsPage/CollectionsPage';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LikesProvider>
          <WatchListProvider>
            <CollectionsProvider>
              <RecentlyWatchedProvider>
                <SearchHistoryProvider>
                  <UserRatingsProvider>
                    <div className="app">
                      <NewNavbar />
                      <AnimatePresence mode="wait">
                        <Routes>
                          <Route path="/" element={<NewHome />} />
                          <Route path="/liked" element={<LikedPage />} />
                          <Route path="/watch-list" element={<WatchListPage />} />
                          <Route path="/recommendations" element={<RecommendationsPage />} />
                          <Route path="/search" element={<Search />} />
                          <Route path="/collections" element={<CollectionsPage />} />
                          <Route path="/analytics" element={<AnalyticsPage />} />
                          <Route path="/movie/:id" element={<ContentDetails />} />
                          <Route path="/tv/:id" element={<ContentDetails />} />
                          
                          <Route path="*" element={
                            <div className="not-found">
                              <h1>404 - Page Not Found</h1>
                              <p>The page you're looking for doesn't exist.</p>
                              <a href="/">Go back to home</a>
                            </div>
                          } />
                        </Routes>
                      </AnimatePresence>
                    </div>
                  </UserRatingsProvider>
                </SearchHistoryProvider>
              </RecentlyWatchedProvider>
            </CollectionsProvider>
          </WatchListProvider>
        </LikesProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
