<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\State\AdopterRegistrationProcessor;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Data accepted to register an adopter account.
 * No "role" field: the server always assigns ROLE_ADOPTER.
 */
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/register/adopter',
            status: 201,
            output: false,
            processor: AdopterRegistrationProcessor::class,
        ),
    ],
)]
final class AdopterRegistration
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email = '';

    // 128 max: enough for password managers, protects the slow hashing
    #[Assert\NotBlank]
    #[Assert\Length(min: 12, max: 128)]
    public string $password = '';
}
