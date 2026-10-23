import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Notice from './components/Notice.jsx';
import { useApp } from './context/AppContext.jsx';
import AddRecipePage from './pages/AddRecipePage.jsx';
import CollectionsPage from './pages/CollectionsPage.jsx';
import DishPage from './pages/DishPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MyRecipesPage from './pages/MyRecipesPage.jsx';
import RecipePage from './pages/RecipePage.jsx';

// Picks which page to show based on the current "view".
function CurrentPage() {
  const { view, params } = useApp();

  switch (view) {
    case 'login':
      return <LoginPage />;
    case 'add':
      return <AddRecipePage />;
    case 'dish':
      return <DishPage key={params.key} dishKey={params.key} />;
    case 'recipe':
      return (
        <RecipePage
          key={`${params.source}-${params.id}`}
          source={params.source}
          id={params.id}
        />
      );
    case 'collections':
      return <CollectionsPage />;
    case 'mine':
      return <MyRecipesPage />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Notice />
        <CurrentPage />
      </main>
      <Footer />
    </>
  );
}
