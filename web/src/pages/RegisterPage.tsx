import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterFormValues = {
  email: string;
  password: string;
};

// One error returned by the API (HTTP 422)
type Violation = {
  propertyPath: string;
  message: string;
};

function RegisterPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();
  const [isRegistered, setIsRegistered] = useState(false);

  async function onSubmit(values: RegisterFormValues) {
    const response = await fetch('/api/register/adopter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/ld+json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      setIsRegistered(true);
      return;
    }

    if (response.status === 422) {
      const body: { violations: Violation[] } = await response.json();
      for (const violation of body.violations) {
        setError(violation.propertyPath as keyof RegisterFormValues, {
          message: violation.message,
        });
      }
      return;
    }

    setError('root', {
      message: 'Une erreur est survenue. Réessayez plus tard.',
    });
  }

  if (isRegistered) {
    return (
      <main className="mx-auto max-w-sm p-4">
        <h1 className="mb-6 text-2xl font-semibold">Compte créé</h1>
        <p>
          Vous pouvez maintenant{' '}
          <Link to="/connexion" className="underline">
            vous connecter
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm p-4">
      <h1 className="mb-6 text-2xl font-semibold">Inscription</h1>

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
            aria-invalid={errors.email ? true : undefined}
            aria-describedby="email-error"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby="password-error"
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Créer mon compte
        </Button>
      </form>
    </main>
  );
}

export default RegisterPage;
