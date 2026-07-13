<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CorsTest extends TestCase
{
    use RefreshDatabase;

    public function test_allowed_origins_is_not_a_wildcard(): void
    {
        $this->assertNotContains('*', config('cors.allowed_origins'));
        $this->assertSame([env('FRONTEND_URL', 'http://localhost:4200')], config('cors.allowed_origins'));
    }

    public function test_preflight_request_from_frontend_origin_is_allowed(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:4200',
            'Access-Control-Request-Method' => 'GET',
        ])->options('/api/v1/tarefas');

        $response->assertStatus(204)
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    }

    public function test_actual_request_from_frontend_origin_receives_cors_header(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:4200',
        ])->getJson('/api/v1/tarefas');

        $response->assertStatus(200)
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    }

    public function test_non_api_routes_do_not_receive_cors_headers(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:4200',
        ])->get('/up');

        $response->assertHeaderMissing('Access-Control-Allow-Origin');
    }
}
