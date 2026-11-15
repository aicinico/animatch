<?php

declare(strict_types=1);

namespace App\Entity;

/**
 * The three possible roles. An account has exactly one of them.
 */
enum UserRole: string
{
    case Adopter = 'ROLE_ADOPTER';
    case Shelter = 'ROLE_SHELTER';
    case Admin = 'ROLE_ADMIN';
}
