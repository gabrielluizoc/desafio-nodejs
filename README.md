# Desafio para backend em Nodejs

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)

Neste **README** estarei descrevendo como executar a API e a descrição breve de cada endpoint.

## Banco de Dados

Os arquivos desta seção estão presentes no `./src/database/`.

Antes de iniciar o projeto é importante a criação do banco de dados, o nome definido para o banco e que está presente na 
modelagem para a sincronização com o host foi `todo`.

Após a criação do banco de dados é necessário a execução dos `initial_scripts.sql` para que sejam criados os tipos de
usuários, um usuário administrador e um view para facilitar a visualização dos dados.

A configuração de conexão com o banco de dados deve ser realizado no `index.js`.

## Configuração

Para o projeto ainda é necessário a criação de um arquivo na `./src` com o nome de `.env` com uma cópia do que está
presente no `env-example.txt`, não é necessário a alteração deste arquivo pois pois para a senha cadastrada para o admin
foi utilizado essas mesmas configurações.

## Instalação

```shell
$ npm install
```

## Estrutura

``` bash
.
├── env-example.txt
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── config
│   │   └── index.js
│   ├── controllers
│   │   ├── admins
│   │   │   ├── index.js
│   │   │   └── todo-controller.js
│   │   ├── auth-controller.js
│   │   ├── forgot-password-controller.js
│   │   ├── index.js
│   │   ├── upload-controller.js
│   │   └── users
│   │       ├── index.js
│   │       └── todo-controller.js
│   ├── database
│   │   ├── database.mwb
│   │   ├── index.js
│   │   └── initial_scripts.sql
│   ├── index.js
│   ├── middleware
│   │   └── auth-middleware.js
│   ├── routes
│   │   ├── admins
│   │   │   ├── index.js
│   │   │   └── todo-route.js
│   │   ├── auth-route.js
│   │   ├── forgot-password-route.js
│   │   ├── index.js
│   │   ├── upload-route.js
│   │   └── users
│   │       ├── index.js
│   │       └── todo-route.js
│   └── utils
│       └── index.js
└── uploads
```

## Endpoints

> ./src/routes/auth-route.js `/auth`

- `POST - /verify-email`

Endpoint onde se é feito a verificação da existência de um email.

| Body Params | Description | Type |
| ------------- | ------------- | ---|
| email  | Email | STRING |

``` json
{
  "email": "email@email.com"  
} 
```

- `GET - /verify-token`

Endpoint onde é feito a verificação do token e sua validade.

- `POST - /register`

Endpoint onde é realizado o cadastro, no entanto apenas para o cadastro de usuários do tipo `Client` e não `Admin`.

| Body Params | Description | Type |
| ------------- | ------------- | ---|
| email  | Email do usuário  | STRING |
| password  | Senha do usuário  | STRING |

``` json
{
  "email": "email@email.com",
  "password": "password"  
} 
```

- `POST - /authenticate`

Endpoint onde é realizado a autenticação dos usuários.

| Body Params | Description | Type |
| ------------- | ------------- | ---|
| email  | Email do usuário  | STRING |
| password  | Senha do usuário  | STRING |

``` json
{
  "email": "email@email.com",
  "password": "password"  
} 
```

### Clients

É necessário passar o Token no Header.

> Authorization: Bearer TOKEN

> ./src/routes/users/todo-route.js `/users/todo`

- `POST - /`

Endpoint onde se é feito a criação de um "board" de To Do List.

| Body Params | Description | Type |
| ------------- | ------------- | ---|
| name  | Nome da Tarefa  | STRING |
| description  | Descrição da Tarefa  | STRING |

``` json
{
  "name": "Trabalho",
  "description": "To Do destinado para atividades do trabalho."
}
```

- `GET - /`

Endpoint onde é feito a listagem dos "boards" de To Do List.

- `PATCH - /:idToDoList`

Endpoint onde é realizado a edição do "board".

| Path Params | Description | Type |
| ------------- | ------------- | ---|
| idToDoList  | ID do Board de To Do  | INT |

| Body Params | Description | Type |
| ------------- | ------------- | ---|
| name  | Nome da Tarefa  | STRING |
| description  | Descrição da Tarefa  | STRING |

```json 
{
  "name": "Tarefas",
  "description": "Lista destinada Tarefas"
}
```

- `POST - /:idToDoList/tasks`

Endpoint onde é realizado a criação de tarefas para o board de To Do List.

| Path Params | Description | Type |
| ------------- | ------------- | ---|
| idToDoList  | ID do Board de To Do  | INT |


| Body Params | Description | Type |
| ------------- | ------------- | ---|
| name  | Nome da Tarefa  | STRING |
| description  | Descrição da Tarefa  | STRING |
| endAt  | Data e Hora da Finalização da Tarefa  | DATETIME |

```json
{
  "name": "Funcionalidade de Cadastro",
  "description": "Adicionar nova funcionalidade na plataforma.",
  "endAt": "2021-09-06 20:00:00"
}
```

- `GET - /:idToDoList/tasks`

Endpoint onde é realizado a listagem de tarefas do board de To Do List.

- `PATCH - /:idToDoList/tasks/:idTask`

Endpoint onde é realizado a edição de tarefas do board de To Do List.

| Path Params | Description | Type |
| ------------- | ------------- | ---|
| idToDoList  | ID do Board de To Do  | INT |
| idTask  | ID da Tarefa  | INT |


| Body Params | Description | Type |
| ------------- | ------------- | ---|
| name  | Nome da Tarefa  | STRING |
| description  | Descrição da Tarefa  | STRING |
| endAt  | Data e Hora da Finalização da Tarefa  | DATETIME |
| wasFinished  | Tarefa finalizada  | BOOLEAN |

```json
{
  "name": "Funcionalidade de Login de Clientes",
  "description": "Adicionar nova funcionalidade na plataforma.",
  "endAt": "2021-09-06 20:00:00",
  "wasFinished": true
}
```

### Admins

É necessário passar o Token no Header.

> Authorization: Bearer TOKEN

> ./src/routes/admins/todo-route.js `/admins/todo`

- `GET - /tasks?page=1&limit=10`

Endpoint onde é listado todas as tarefas de To Do List.

| Query Params | Description | Type |
| ------------- | ------------- | ---|
| page*  | Página a qual deseja estar vendo as informações  | INT |
| limit*  | Limite de registros por página  | INT |


| Body Params | Description | Type |
| ------------- | ------------- | ---|
| status  | Tipo de status a ser filtrado podendo ser "Em andamento", "Em atraso" e "Finalizado", se nenhum for definido será mostrado todos os status | STRING |

## Decisões tomadas durante o desafio técnico

Uma das decisões que foram tomadas para o desafio foi no utilizar o momentjs para fazer a verificação do status de cada
tarefa e sim utilizar o banco de dados para realizar essa verificação com a criação de uma view utilizando na mesma um CASE.
Outra regra que não estava presente mas foi a criação dos boards de To Do List permitindo o usuário a ter diversos outros 
boards.
