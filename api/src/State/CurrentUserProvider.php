<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\CurrentUser;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * Builds the CurrentUser from the account found in the JWT.
 *
 * @implements ProviderInterface<CurrentUser>
 */
final class CurrentUserProvider implements ProviderInterface
{
    public function __construct(
        private readonly Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): CurrentUser
    {
        $user = $this->security->getUser();

        // The access rules already require a valid JWT: this never happens
        if (!$user instanceof User) {
            throw new \LogicException('GET /api/me requires a logged-in user.');
        }

        return new CurrentUser($user->getEmail(), $user->getRole()->value);
    }
}
