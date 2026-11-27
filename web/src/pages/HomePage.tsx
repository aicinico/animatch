import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { apiFetch, logout } from '@/lib/auth';

// What GET /api/me returns
type CurrentUser = {
  email: string;
  role: string;
};

// Role names shown to the user
const ROLE_LABELS: Record<string, string> = {
  ROLE_ADOPTER: 'adoptant',
  ROLE_SHELTER: 'refuge',
  ROLE_ADMIN: 'administrateur',
};

function HomePage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Once, when the page appears: ask the API who is logged in
  useEffect(() => {
    async function loadCurrentUser() {
      const response = await apiFetch('/api/me');
      if (response.ok) {
        setCurrentUser(await response.json());
      }
    }

    loadCurrentUser();
  }, []);

  async function handleLogout() {
    await logout();
    setCurrentUser(null);
  }

  return (
    <main className="p-4">
      <h1>Animatch</h1>
      <p>Adoptez un chat ou un chien près de chez vous.</p>

      {currentUser ? (
        <div className="mt-4 flex items-center gap-4">
          <p>
            Connecté en tant que {currentUser.email} (
            {ROLE_LABELS[currentUser.role]})
          </p>
          <Button variant="outline" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>
      ) : (
        <p className="mt-4">
          <Link to="/connexion" className="underline">
            Se connecter
          </Link>{' '}
          ou{' '}
          <Link to="/inscription" className="underline">
            créer un compte
          </Link>
        </p>
      )}
    </main>
  );
}

export default HomePage;
