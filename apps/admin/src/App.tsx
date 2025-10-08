import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { observeAuthState, getCurrentUser } from '@wishlabs/firebase';
import { User } from '@wishlabs/shared';
import AdminNavbar from '@admin/components/AdminNavbar';
import WorldGenerationPage from '@admin/pages/WorldGenerationPage';
import UsersPage from '@admin/pages/UsersPage';
import MonitoringPage from '@admin/pages/MonitoringPage';
import DataToolsPage from '@admin/pages/DataToolsPage';
import LoginPrompt from '@admin/components/LoginPrompt';

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
        <div className="text-xl">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user ? (
          <>
            <AdminNavbar user={user} />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<WorldGenerationPage />} />
                <Route path="/world-generation" element={<WorldGenerationPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/monitoring" element={<MonitoringPage />} />
                <Route path="/data-tools" element={<DataToolsPage />} />
              </Routes>
            </main>
          </>
        ) : (
          <LoginPrompt />
        )}
      </div>
    </Router>
  );
}

export default App;
