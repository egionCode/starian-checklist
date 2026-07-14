import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Tarefa, TarefaService } from './tarefa.service';

describe('TarefaService', () => {
  let service: TarefaService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tarefas`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(TarefaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getTarefas deve fazer GET na lista de tarefas', () => {
    const mock: Tarefa[] = [{ id: 1, title: 'Teste', completed: false }];

    service.getTarefas().subscribe((tarefas) => expect(tarefas).toEqual(mock));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('createTarefa deve fazer POST com o title informado', () => {
    const mock: Tarefa = { id: 2, title: 'Nova tarefa', completed: false };

    service.createTarefa('Nova tarefa').subscribe((tarefa) => expect(tarefa).toEqual(mock));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Nova tarefa' });
    req.flush(mock);
  });

  it('updateTarefa deve fazer PUT com o payload informado', () => {
    const mock: Tarefa = { id: 1, title: 'Teste', completed: true };

    service.updateTarefa(1, { completed: true }).subscribe((tarefa) => expect(tarefa).toEqual(mock));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ completed: true });
    req.flush(mock);
  });

  it('deleteTarefa deve fazer DELETE no id informado', () => {
    service.deleteTarefa(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
