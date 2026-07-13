<?php

namespace Tests\Feature;

use App\Models\Tarefa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TarefaControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_all_tarefas(): void
    {
        Tarefa::create(['title' => 'Primeira tarefa', 'completed' => false]);
        Tarefa::create(['title' => 'Segunda tarefa', 'completed' => true]);

        $response = $this->getJson('/api/v1/tarefas');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['title' => 'Primeira tarefa'])
            ->assertJsonFragment(['title' => 'Segunda tarefa']);
    }

    public function test_index_returns_empty_array_when_there_are_no_tarefas(): void
    {
        $response = $this->getJson('/api/v1/tarefas');

        $response->assertStatus(200)
            ->assertExactJson([]);
    }

    public function test_show_returns_the_tarefa(): void
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa única', 'completed' => false]);

        $response = $this->getJson("/api/v1/tarefas/{$tarefa->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $tarefa->id)
            ->assertJsonPath('title', 'Tarefa única');
    }

    public function test_show_returns_404_for_nonexistent_tarefa(): void
    {
        $response = $this->getJson('/api/v1/tarefas/999');

        $response->assertStatus(404);
    }

    public function test_store_creates_a_tarefa_and_persists_it(): void
    {
        $response = $this->postJson('/api/v1/tarefas', [
            'title' => 'Estudar Laravel',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('title', 'Estudar Laravel')
            ->assertJsonPath('completed', false);

        $this->assertDatabaseHas('tarefas', [
            'title' => 'Estudar Laravel',
            'completed' => false,
        ]);
    }

    public function test_store_requires_title(): void
    {
        $response = $this->postJson('/api/v1/tarefas', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('title');

        $this->assertDatabaseCount('tarefas', 0);
    }

    public function test_store_requires_title_to_be_a_string(): void
    {
        $response = $this->postJson('/api/v1/tarefas', [
            'title' => ['not', 'a', 'string'],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('title');
    }

    public function test_store_requires_title_to_not_exceed_max_length(): void
    {
        $response = $this->postJson('/api/v1/tarefas', [
            'title' => str_repeat('a', 256),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('title');
    }

    public function test_update_changes_title_and_completed_and_persists_it(): void
    {
        $tarefa = Tarefa::create([
            'title' => 'Tarefa original',
            'completed' => false,
        ]);

        $response = $this->putJson("/api/v1/tarefas/{$tarefa->id}", [
            'title' => 'Tarefa atualizada',
            'completed' => true,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('title', 'Tarefa atualizada')
            ->assertJsonPath('completed', true);

        $this->assertDatabaseHas('tarefas', [
            'id' => $tarefa->id,
            'title' => 'Tarefa atualizada',
            'completed' => true,
        ]);
    }

    public function test_update_accepts_partial_payload(): void
    {
        $tarefa = Tarefa::create([
            'title' => 'Tarefa original',
            'completed' => false,
        ]);

        $response = $this->putJson("/api/v1/tarefas/{$tarefa->id}", [
            'completed' => true,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('title', 'Tarefa original')
            ->assertJsonPath('completed', true);

        $this->assertDatabaseHas('tarefas', [
            'id' => $tarefa->id,
            'title' => 'Tarefa original',
            'completed' => true,
        ]);
    }

    public function test_update_rejects_empty_title(): void
    {
        $tarefa = Tarefa::create([
            'title' => 'Tarefa original',
            'completed' => false,
        ]);

        $response = $this->putJson("/api/v1/tarefas/{$tarefa->id}", [
            'title' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('title');

        $this->assertDatabaseHas('tarefas', [
            'id' => $tarefa->id,
            'title' => 'Tarefa original',
        ]);
    }

    public function test_update_returns_404_for_nonexistent_tarefa(): void
    {
        $response = $this->putJson('/api/v1/tarefas/999', [
            'title' => 'Não existe',
        ]);

        $response->assertStatus(404);
    }

    public function test_destroy_deletes_the_tarefa(): void
    {
        $tarefa = Tarefa::create(['title' => 'Tarefa a remover', 'completed' => false]);

        $response = $this->deleteJson("/api/v1/tarefas/{$tarefa->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('tarefas', ['id' => $tarefa->id]);
    }

    public function test_destroy_returns_404_for_nonexistent_tarefa(): void
    {
        $response = $this->deleteJson('/api/v1/tarefas/999');

        $response->assertStatus(404);
    }
}
