<?php

declare(strict_types=1);

namespace App\Tests\Functional;

use ApiPlatform\Test\ApiTestCase;

final class HealthTest extends ApiTestCase
{
    public function testReportsOkWhenDatabaseIsReachable(): void
    {
        static::createClient()->request('GET', '/health');

        self::assertResponseStatusCodeSame(200);
        self::assertJsonEquals(['status' => 'ok', 'database' => 'ok']);
    }
}
