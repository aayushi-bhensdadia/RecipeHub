import { Route, Routes, useParams } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Notice from './components/Notice.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AddRecipePage from './pages/AddRecipePage.jsx';
import CollectionsPage from './pages/CollectionsPage.jsx';
import DishPage from './pages/DishPage.jsx';
import EditRecipePage from './pages/EditRecipePage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MyRecipesPage from './pages/MyRecipesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import RecipePage from './pages/RecipePage.jsx';

// The `key` makes React reload the page when only the URL parameter changes
// (e.g. /recipe/1 -> /recipe/2).
function DishRoute() {
  const { key } = useParams();
  return <DishPage key={key} dishKey={key} />;
}

function RecipeRoute({ source }) {
  const { id } = useParams();
  return <RecipePage key={`${source}-${id}`} source={source} id={id} />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <main className="mx-auto max-w-[1120px] px-3.5 pt-5 pb-[45px] sm:px-5 sm:pt-7 sm:pb-[70px]">
        <Notice />

        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage mode="login" />} />
          <Route path="/register" element={<LoginPage mode="register" />} />
          <Route path="/dish/:key" element={<DishRoute />} />
          <Route path="/recipe/:id" element={<RecipeRoute source="community" />} />
          <Route path="/online/:id" element={<RecipeRoute source="online" />} />

          {/* Login-only pages */}
          <Route path="/add" element={<ProtectedRoute><AddRecipePage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
          <Route path="/my-recipes" element={<ProtectedRoute><MyRecipesPage /></ProtectedRoute>} />
          <Route path="/recipe/:id/edit" element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />

          {/* Anything else */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
