import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarefa, TarefaService } from './tarefa.service';

@Component({
  selector: 'app-tarefa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarefa.component.html',
  styleUrl: './tarefa.component.scss'
})
export class TarefaComponent implements OnInit {
  title = 'Lista de Tarefas';
  tarefas: Tarefa[] = [];
  newTarefaTitle = '';
  loading = false;
  errorMessage: string | null = null;

  constructor(private tarefaService: TarefaService) {}

  ngOnInit(): void {
    this.loadTarefas();
  }

  loadTarefas(): void {
    this.loading = true;
    this.errorMessage = null;

    this.tarefaService.getTarefas().subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar as tarefas.';
        this.loading = false;
      }
    });
  }

  addTarefa(): void {
    if (!this.newTarefaTitle.trim()) return;

    this.loading = true;
    this.errorMessage = null;

    this.tarefaService.createTarefa(this.newTarefaTitle).subscribe({
      next: (tarefa) => {
        this.tarefas.push(tarefa);
        this.newTarefaTitle = '';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível adicionar a tarefa.';
        this.loading = false;
      }
    });
  }

  removeTarefa(id: number): void {
    this.errorMessage = null;

    this.tarefaService.deleteTarefa(id).subscribe({
      next: () => {
        this.tarefas = this.tarefas.filter((tarefa) => tarefa.id !== id);
      },
      error: () => {
        this.errorMessage = 'Não foi possível remover a tarefa.';
      }
    });
  }

  finalizarTarefa(tarefa: Tarefa): void {
    this.errorMessage = null;

    this.tarefaService.updateTarefa(tarefa.id, { completed: true }).subscribe({
      next: (tarefaAtualizada) => {
        tarefa.completed = tarefaAtualizada.completed;
      },
      error: () => {
        this.errorMessage = 'Não foi possível finalizar a tarefa.';
      }
    });
  }
}
