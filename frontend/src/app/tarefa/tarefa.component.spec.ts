import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TarefaComponent } from './tarefa.component';
import { Tarefa, TarefaService } from './tarefa.service';

describe('TarefaComponent', () => {
  let component: TarefaComponent;
  let fixture: ComponentFixture<TarefaComponent>;
  let tarefaServiceSpy: jasmine.SpyObj<TarefaService>;

  const tarefaMock: Tarefa = { id: 1, title: 'Teste', completed: false };

  beforeEach(async () => {
    tarefaServiceSpy = jasmine.createSpyObj('TarefaService', [
      'getTarefas',
      'createTarefa',
      'updateTarefa',
      'deleteTarefa'
    ]);
    tarefaServiceSpy.getTarefas.and.returnValue(of([tarefaMock]));

    await TestBed.configureTestingModule({
      imports: [TarefaComponent],
      providers: [{ provide: TarefaService, useValue: tarefaServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TarefaComponent);
    component = fixture.componentInstance;
  });

  it('deve carregar as tarefas no ngOnInit (loadTarefas)', () => {
    fixture.detectChanges();

    expect(tarefaServiceSpy.getTarefas).toHaveBeenCalled();
    expect(component.tarefas).toEqual([tarefaMock]);
    expect(component.loading).toBeFalse();
  });

  it('loadTarefas deve setar errorMessage quando a API falha', () => {
    tarefaServiceSpy.getTarefas.and.returnValue(throwError(() => new Error('falhou')));

    component.loadTarefas();

    expect(component.errorMessage).toBe('Não foi possível carregar as tarefas.');
    expect(component.loading).toBeFalse();
  });

  it('addTarefa não deve chamar o service se o título estiver vazio', () => {
    component.newTarefaTitle = '   ';

    component.addTarefa();

    expect(tarefaServiceSpy.createTarefa).not.toHaveBeenCalled();
  });

  it('addTarefa deve criar a tarefa e limpar o campo', () => {
    const novaTarefa: Tarefa = { id: 2, title: 'Nova', completed: false };
    tarefaServiceSpy.createTarefa.and.returnValue(of(novaTarefa));
    component.newTarefaTitle = 'Nova';

    component.addTarefa();

    expect(component.tarefas).toContain(novaTarefa);
    expect(component.newTarefaTitle).toBe('');
  });

  it('addTarefa deve setar errorMessage quando a API falha', () => {
    tarefaServiceSpy.createTarefa.and.returnValue(throwError(() => new Error('falhou')));
    component.newTarefaTitle = 'Nova';

    component.addTarefa();

    expect(component.errorMessage).toBe('Não foi possível adicionar a tarefa.');
  });

  it('removeTarefa deve remover a tarefa da lista', () => {
    component.tarefas = [tarefaMock];
    tarefaServiceSpy.deleteTarefa.and.returnValue(of(undefined));

    component.removeTarefa(tarefaMock.id);

    expect(component.tarefas).toEqual([]);
  });

  it('finalizarTarefa deve marcar a tarefa como completed', () => {
    const tarefa = { ...tarefaMock };
    tarefaServiceSpy.updateTarefa.and.returnValue(of({ ...tarefa, completed: true }));

    component.finalizarTarefa(tarefa);

    expect(tarefaServiceSpy.updateTarefa).toHaveBeenCalledWith(tarefa.id, { completed: true });
    expect(tarefa.completed).toBeTrue();
  });
});
