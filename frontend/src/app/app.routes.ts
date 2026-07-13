import { Routes } from '@angular/router';
import { TarefaComponent } from './tarefa/tarefa.component';

export const routes: Routes = [
  { path: '', component: TarefaComponent },
  { path: '**', redirectTo: '' },
];
