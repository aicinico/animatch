<?php

declare(strict_types=1);

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HealthController extends AbstractController
{
    #[Route('/health', name: 'health', methods: ['GET'])]
    public function __invoke(Connection $connection): JsonResponse
    {
        try {
            // Cheapest possible query: proves the database answers
            $connection->executeQuery('SELECT 1');
        } catch (\Throwable) {
            return $this->json(
                ['status' => 'error', 'database' => 'unreachable'],
                Response::HTTP_SERVICE_UNAVAILABLE,
            );
        }

        return $this->json(['status' => 'ok', 'database' => 'ok']);
    }
}
