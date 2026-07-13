## Backend

- Removido a inclusão das rotas de api no arquivo web.php
- Aprimorada a definição de camadas, Model, Controller, Request foram criadas para melhor separação
- criando rotas definidas do apiResource ( laravel helper para chamada de rotas de listagem, show, update, store e delete)
- aproveitei e criei alguns testes para boas práticas de coding
- visto que backend é uma API REST, alterei o bootstrap para carregar somente as rotas api.php
- adicionado versionamento de rotas ( boa prática para REST API )
- travando a api para funcionar somente no mesmo domínio usando cors ( tomei a liberdade de usar o cors que o laravel já fornece em seu pacote default ) PRECISA TESTAR
- aplicado ratelimiter para evitar explosão de requests
- removi o tarefas.json do repositório
- removido migrations desnecessárias e deixando uma para as tarefas, usando sqlite no momento

## Frontend

- adicionando arquivo de environment para o frontend com url da api, removendo todos os url que estão hardcoded
- criei uma service para as chamadas de api, deixando as tarefas separdas por camadas
- criando classes para estilização, e alimentado o arquivo de estilização do componente
- algumas modificações para melhorar responsividade
- as classes estão com a convenção BEM, onde __ indica elemento e o -- são modificadores de elementos
- adicionei redirecionamento de rotas ( um pouco de overegineering aqui, visto que só tem uma rota, não tinha muito necessidade, mas aplicações em angular, em sua maioria usa essa estrutura de rotas, e até facilita na estilização )
- adicionei tipagens às chamadas
- adicionei o update nas tarefas, no codigo original nao tinha como finalizar uma terefa, porem no objeto existe a propriedade completed
