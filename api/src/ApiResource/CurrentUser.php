<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\CurrentUserProvider;

/**
 * The logged-in user, as returned by GET /api/me.
 * Only what the interface needs: never the password.
 */
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/me',
            provider: CurrentUserProvider::class,
        ),
    ],
)]
final class CurrentUser
{
    public function __construct(
        public readonly string $email,
        public readonly string $role,
    ) {
    }
}
