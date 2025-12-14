# Task Generator API

## 🇧🇷 Português

### Descrição do Projeto

Esta é uma API de gerenciamento de listas de tarefas com um gerador de subtarefas integrado, desenvolvida com **NestJS** e **TypeScript**, seguindo os princípios de **SOLID** e **Arquitetura Limpa (Clean Architecture)**, com foco em **Domain-Driven Design (DDD)**. O objetivo principal é gerenciar listas de tarefas, com a funcionalidade de gerar tarefas automaticamente através de um serviço externo (OpenRouter/LLM).

O projeto utiliza **SQLite** como banco de dados, o que o torna leve e fácil de configurar para desenvolvimento local.

### Arquitetura

O projeto adota uma arquitetura limpa, separando as responsabilidades em camadas:

1.  **Domain (`src/domain`)**: Contém as entidades de negócio (`List`, `Task`), interfaces de repositório (`ListRepository`) e interfaces de serviços externos (`TaskGeneratorService`). É a camada mais interna e não possui dependências externas.
2.  **Application (`src/application`)**: Contém os Casos de Uso (Use Cases) que orquestram o fluxo de trabalho da aplicação, implementando a lógica de negócio. Eles dependem apenas das interfaces definidas no Domain.
3.  **Infrastructure (`src/infrastructure`)**: Contém as implementações concretas das interfaces do Domain.
    *   **Persistência**: Utiliza **TypeORM** com **SQLite** (`database.sqlite`) para o repositório de listas.
    *   **Serviço Externo**: Implementação do `TaskGeneratorService` para integração com o **OpenRouter**.
4.  **Presentation (`src/presentation`)**: Contém os `Controllers` (endpoints HTTP) e os `DTOs` (Data Transfer Objects) para entrada e saída de dados.

### Pré-requisitos

Para garantir o funcionamento correto do banco de dados SQLite e das dependências do projeto, é **altamente recomendado** utilizar a seguinte versão do Node.js:

*   **Node.js:** Versão 20.x

### Instalação e Configuração

**Atenção:** O projeto é entregue com as dependências já configuradas. Você precisará executar a instalação das dependências (`npm install` ou `pnpm install`) no seu ambiente.

1.  **Instale as dependências:**
    ```bash
    # Exemplo:
    # npm install
    ```

2.  **Configuração do Banco de Dados:**
    O projeto utiliza TypeORM com SQLite. O arquivo `database.sqlite` já está presente na raiz do projeto.

3.  **Chave de API (API Key):**
    Conforme a premissa do projeto, a chave de API para o serviço de geração de tarefas (OpenRouter) **deve ser fornecida pelo frontend** através do corpo da requisição no endpoint de criação de lista. O backend não armazena esta chave.

### Scripts Disponíveis

| Script | Descrição |
| :--- | :--- |
| `npm run build` | Compila o projeto para a pasta `dist`. |
| `npm run start:dev` | Inicia o servidor em modo de desenvolvimento com *hot-reload*. |
| `npm run start:prod` | Inicia o servidor em modo de produção. |

### Linting e Formatação

Para manter a qualidade e a consistência do código, o projeto está configurado com **ESLint** e **Prettier**.

| Script | Descrição |
| :--- | :--- |
| `npm run lint` | Executa o ESLint para verificar erros de código, incluindo imports não utilizados e problemas de estilo. |
| `npm run lint:fix` | Executa o ESLint e tenta corrigir automaticamente os problemas encontrados. |
| `npm run format` | Executa o Prettier para formatar o código no padrão definido (`.prettierrc`). |

### Endpoints

Todos os endpoints estão sob o prefixo `/lists`.

| Método | Caminho | Descrição |
| :--- | :--- | :--- |
| `POST` | `/lists` | **createList**: Recebe um `prompt` e a `openRouterApiKey` no corpo da requisição, chama o OpenRouter para gerar a lista de tarefas, salva no banco de dados e retorna a lista criada. |
| `GET` | `/lists` | **getLists**: Retorna todas as listas de tarefas salvas no banco de dados. |
| `PATCH` | `/lists/:listId/tasks/:taskIndex` | **updateTask**: Atualiza o status de conclusão (`isCompleted`) de uma tarefa específica dentro de uma lista. |
| `DELETE` | `/lists/:listId/tasks/:taskIndex` | **deleteTask**: Remove uma tarefa específica de uma lista. |

### Exemplo de Requisição `POST /lists`

**Corpo da Requisição (JSON):**

```json
{
  "prompt": "Criar um plano de estudos para aprender NestJS em 7 dias."
}
```

**Resposta (JSON):**

```json
{
  "id": "uuid-da-lista",
  "prompt": "Criar um plano de estudos para aprender NestJS em 7 dias.",
  "createdAt": "2025-12-12T15:00:00.000Z",
  "tasks": [
    {
      "index": 1,
      "title": "Instalar Node.js e NestJS CLI",
      "isCompleted": false,
      "createdAt": "2025-12-12T15:00:00.000Z"
    },
    // ... outras tarefas
  ]
}
```

### Melhorias Aplicadas (Revisão de Código)

Durante a revisão, foram aplicadas as seguintes melhorias conforme suas sugestões:

1.  **Uso de Aliases de Módulo:** Todos os imports relativos (`../domain`, `../../infrastructure`, etc.) foram substituídos pelos aliases configurados em `tsconfig.json` (`@domain`, `@application`, etc.), tornando o código mais limpo e menos propenso a erros de refatoração.
2.  **Separação de Responsabilidades (SRP) em `lists.module.ts`:** A injeção duplicada do `TypeOrmListRepository` foi removida, simplificando a configuração do módulo.
3.  **Lógica de Domínio (`deleteTask`):** A reindexação das tarefas foi removida da entidade de domínio (`list.entity.ts`) e movida para o caso de uso (`delete-task.usecase.ts`). Isso garante que a entidade de domínio se concentre apenas em sua lógica de negócio, enquanto a reindexação (que é uma preocupação de persistência/aplicação) é tratada na camada apropriada.

---

## 🇺🇸 English

### Project Description

This is a task list management API with an integrated subtask generator, developed with **NestJS** and **TypeScript**, following **SOLID** principles and **Clean Architecture**, with a focus on **Domain-Driven Design (DDD)**. The main goal is to manage task lists, with the functionality to automatically generate tasks through an external service (OpenRouter/LLM).

The project uses **SQLite** as its database, making it lightweight and easy to set up for local development.

### Architecture

The project adopts a clean architecture, separating responsibilities into layers:

1.  **Domain (`src/domain`)**: Contains the business entities (`List`, `Task`), repository interfaces (`ListRepository`), and external service interfaces (`TaskGeneratorService`). It is the innermost layer and has no external dependencies.
2.  **Application (`src/application`)**: Contains the Use Cases that orchestrate the application's workflow, implementing the business logic. They only depend on the interfaces defined in the Domain.
3.  **Infrastructure (`src/infrastructure`)**: Contains the concrete implementations of the Domain interfaces.
    *   **Persistence**: Uses **TypeORM** with **SQLite** (`database.sqlite`) for the list repository.
    *   **External Service**: Implementation of `TaskGeneratorService` for integration with **OpenRouter**.
4.  **Presentation (`src/presentation`)**: Contains the `Controllers` (HTTP endpoints) and `DTOs` (Data Transfer Objects) for data input and output.

### Prerequisites

To ensure the correct functioning of the SQLite database and project dependencies, it is **highly recommended** to use the following Node.js version:

*   **Node.js:** Version 20.x

### Installation and Configuration

**Attention:** The project is delivered with dependencies already configured. You will need to run the dependency installation (`npm install` or `pnpm install`) in your environment.

1.  **Install dependencies:**
    ```bash
    # Example:
    # npm install
    ```

2.  **Database Configuration:**
    The project uses TypeORM with SQLite. The `database.sqlite` file is already present in the project root.

3.  **API Key:**
    As per the project's premise, the API key for the task generation service (OpenRouter) **must be provided by the frontend** through the request body in the list creation endpoint. The backend does not store this key.

### Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run build` | Compiles the project to the `dist` folder. |
| `npm run start:dev` | Starts the server in development mode with *hot-reload*. |
| `npm run start:prod` | Starts the server in production mode. |

### Linting and Formatting

To maintain code quality and consistency, the project is configured with **ESLint** and **Prettier**.

| Script | Description |
| :--- | :--- |
| `npm run lint` | Runs ESLint to check for code errors, including unused imports and style issues. |
| `npm run lint:fix` | Runs ESLint and attempts to automatically fix the found issues. |
| `npm run format` | Runs Prettier to format the code according to the defined standard (`.prettierrc`). |

### Endpoints

All endpoints are under the `/lists` prefix.

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/lists` | **createList**: Receives a `prompt` and the `openRouterApiKey` in the request body, calls OpenRouter to generate the task list, saves it to the database, and returns the created list. |
| `GET` | `/lists` | **getLists**: Returns all task lists saved in the database. |
| `PATCH` | `/lists/:listId/tasks/:taskIndex` | **updateTask**: Updates the completion status (`isCompleted`) of a specific task within a list. |
| `DELETE` | `/lists/:listId/tasks/:taskIndex` | **deleteTask**: Removes a specific task from a list. |

### Example `POST /lists` Request

**Request Body (JSON):**

```json
{
  "prompt": "Create a study plan to learn NestJS in 7 days."
}
```

**Response (JSON):**

```json
{
  "id": "list-uuid",
  "prompt": "Create a study plan to learn NestJS in 7 days.",
  "createdAt": "2025-12-12T15:00:00.000Z",
  "tasks": [
    {
      "index": 1,
      "title": "Install Node.js and NestJS CLI",
      "isCompleted": false,
      "createdAt": "2025-12-12T15:00:00.000Z"
    },
    // ... other tasks
  ]
}
```

### Applied Improvements (Code Review)

During the review, the following improvements were applied according to your suggestions:

1.  **Module Aliases Usage:** All relative imports (`../domain`, `../../infrastructure`, etc.) were replaced with the aliases configured in `tsconfig.json` (`@domain`, `@application`, etc.), making the code cleaner and less prone to refactoring errors.
2.  **Separation of Responsibilities (SRP) in `lists.module.ts`:** The duplicate injection of `TypeOrmListRepository` was removed, simplifying the module configuration.
3.  **Domain Logic (`deleteTask`):** Task reindexing was removed from the domain entity (`list.entity.ts`) and moved to the use case (`delete-task.usecase.ts`). This ensures the domain entity focuses only on its business logic, while reindexing (which is a persistence/application concern) is handled in the appropriate layer.
