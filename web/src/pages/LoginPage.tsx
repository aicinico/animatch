import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setAccessToken } from '@/lib/auth';

type LoginFormValues = {
  email: string;
  password: string;
};

function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();
  const navigate = useNavigate();

  async function onSubmit(values: LoginFormValues) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const body: { token: string } = await response.json();
      setAccessToken(body.token);
      navigate('/');
      return;
    }

    setError('root', {
      message:
        response.status === 401
          ? 'Adresse e-mail ou mot de passe incorrect.'
          : 'Une erreur est survenue. Réessayez plus tard.',
    });
  }

  return (
    <main className="mx-auto max-w-sm p-4">
      <h1 className="mb-6 text-2xl font-semibold">Connexion</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </div>

        {errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Se connecter
        </Button>

        <p className="text-sm">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;
