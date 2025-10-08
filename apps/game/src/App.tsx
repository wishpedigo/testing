import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { observeAuthState, getCurrentUser } from '@wishlabs/firebase';
import { User } from '@wishlabs/shared';
import GameScreen from './components/GameScreen';
import LoginPrompt from './components/LoginPrompt';
import GameNavbar from './components/GameNavbar';
import GameEmbedPage from './pages/GameEmbedPage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/game-embed" element={<GameEmbedPage />} />
        <Route path="*" element={
          <div className="min-h-screen">
            <GameNavbar user={user} />
            {user ? <GameScreen user={user} /> : <LoginPrompt />}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

