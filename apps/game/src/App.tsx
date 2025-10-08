import { useState, useEffect } from 'react';
import { observeAuthState, getCurrentUser } from '@wishlabs/firebase';
import { User } from '@wishlabs/shared';
import GameScreen from './components/GameScreen';
import LoginPrompt from './components/LoginPrompt';
import GameNavbar from './components/GameNavbar';

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
    <div className="min-h-screen">
      <GameNavbar user={user} />
      {user ? <GameScreen user={user} /> : <LoginPrompt />}
    </div>
  );
}

export default App;

