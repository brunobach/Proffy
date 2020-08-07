<p align="center">
  <img src="../readme/Home.png"/>
</p>

# 📑 Índice

### [Back-end](#back-end)

- [Instalação e Configuração das Bibliotecas Back-end](#-instalação-e-configuração-das-bibliotecas-back-end)
  - [Configuração de Scripts de Desenvolvimento](#configuração-de-scripts-de-desenvolvimento)
  - [Configurações do Knex](#configurações-do-knex)
  - [Configurações do Sqlite](#configurações-do-sqlite)
- [Server](#server)
- [Criação das Tabelas](#criação-das-rabelas)
  - [Tabela de Usuários](#tabela-de-usuários)
  - [Tabela de Aulas](#tabela-de-Aulas)
  - [Tabela de Agendamento das Aulas](#tabela-de-agendamento-das-aulas)
  - [Tabela de Conexões](#tabela-de-conexões)
- [Função para lidar com os Horários](#função-para-lidar-com-os-Horários)
- [Controllers](#controllers) - [Controller de Aulas](#controller-de-aulas) - [Controller de Conexões](#controller-de-conexões)
- [Rotas](#rotas)
- [Licença](#-licença)

# Back-end

Vamos iniciar a construção da API back-end da nossa aplicação, para isso o Node e o Yarn já devem estar instalados.
Criar uma pasta 'server' para escrever todo o back-end.

## 📚 Instalação e Configuração das Bibliotecas Back-end

**Iniciar o node na pasta** _(cria o arquivo 'package.json')_: `yarn init -y`

**Instalar o Express** _(cria a pasta 'node_modules' e o arquivo 'package-lock.json')_: `yarn add express -D`

**Instalar a definição de tipos do Express**: `yarn add @types/express -D`

**Instalar o Typescript**: `yarn add typescript -D`

**Iniciar o TSC (TypeScript Compiler)** _(cria o arquivo 'tsconfig.json')_: `yarn tsc --init`

**Instalar o TS-Node-DEV**: `yarn add ts-node-dev -D`

**Instalar o knex e o sqlite:** `yarn add knex sqlite3`

**Instalar o CORS:** `yarn add cors`

**Instalar a definição de tipos do CORS:** `yarn add @types/cors`

Depois de todas as dependências instaladas, vamos criar uma pasta 'src' que vai conter nossos arquivos.

## Configuração de Scripts de Desenvolvimento

No arquivo 'package.json', vamos configurar o script para rodar o servidor pelo TS-Node-Dev e também já vamos aproveitar para criar um script de criação de migrations pelo Knex.
O TS-Node-Dev vai compilar nossos arquivos .ts (mesma função do TSC) e também reiniciar o projeto quando o arquivo é modificado (mesma função de um Nodemom, por exemplo).

<img src="https://ik.imagekit.io/dxwebster/Screenshot_2_UJfmFC1Zf.png" />

- A partir de agora, para iniciar o servidor, basta executar `yarn dev:server`
- E quando formos criar nossas migrations, utilizaremos o comando `knex:migrate`

## Configurações do Knex

Na pasta src, criar uma pasta 'database' e um arquivo 'connection.ts'. Esse arquivo será responsável pela nossa conexão com o banco de dados. Vamos criar uma função que do Knex que procura na pasta 'database' um arquivo chamado 'database.sqlite' para fazer a conexão com o banco de dados.

```ts
import knex from "knex";
import path from "path";

const db = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
});

export default db;
```

Agora na pasta 'src' vamos criar um arquivo 'knexfile.ts' para configuração do knex com o caminho da nossa pasta migrations:

```ts
import path from "path";

module.exports = {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "src", "database", "database.sqlite"),
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "database.sqlite"),
  },
  useNullAsDefault: true,
};
```

## Configurações do Sqlite

Para visualizarmos nossas tabelas, usaremos a extensão 'SQLite' do VScode. Depois de instalar, basta clicar com o botão direito em cima do arquivo 'database.sqlite' e selecionar 'Open Database'. Vai abrir uma aba SQLITE EXPLORER no menu lateral do VSCode para visualizarmos as tabelas que vamos criar para a aplicação.

# Server

Na pasta 'src', vamos criar um arquivo 'server.ts'. O server será o arquivo principal da nossa aplicação. Já configuramos um script para rodar ele no terminal. Vamos começar importando o express, o cors e as rotas. Depois usaremos a função use() para indicar que usaremos formato json, o cors e as nossas rotas. Pelo método listen(), vamos adicionar a porta que nossa aplicação vai rodar, e uma mensagem para aparecer no terminal quando executarmos o servidor.

```ts
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen("3333", () => {
  console.log("> Servidor rodando em http://localhost:3333");
});
```

# Criação das Tabelas

Com as configurações principais feitas, vamos começar nossa aplicação pela criação das tabelas do banco de dados. Vamos criar 4 tabelas:

- Tabela de usuários (id, name, avatar, whatsapp, bio)
- Tabela de aulas (id, subject, cost, user_id)
- Tabela da agenda (week_day, from, to, class_id)
- Tabela de conexões (id, user_id, created_at)

Na mesma pasta 'database' vamos criar uma subpasta 'migrations'. As migrations vão servir como um histórico do banco de dados. Cada tabela ficará em um arquivo separadp dentro das migration, e importante criar cada arquivo numa ordem numérica crescente.

## Tabela de Usuários

Criar um arquivo '00_create_users.ts'. Seguindo a lógica das migrations, primeiro temos a função pra criar a tabela (up) e depois a função para deletar a tabela (down). Dentro da função up(), escrevemos cada coluna e sua característica (chave primária, obrigatoriedade, etc):

```ts
import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("avatar").notNullable();
    table.string("whatsapp").notNullable();
    table.string("bio").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
```

## Tabela de Aulas

Criar um arquivo '01_create_classes.ts', para armazenar as aulas. Nessa tabela teremos uma coluna que faz relacionamento com a tabela 'users'. No campo user_id, vamos armazenar qual user será professor, ou seja, vamos associar um usuário à matéria que ele vai dar aula. E aproveitando, vamos também colocar mais duas informações para os seguintes casos:

- o que acontece com o professor se o id for alterado na tabela?
- o que acontece com as aulas desse professor caso ele seja deletado da plataforma?

Para resolver isso, vamos usar o método CASCADE. Ou seja, caso o id for alterado, será feita a alteração em todos os lugares que essa informação estiver. E caso o professor for deletado, todas as aulas associadas a ele também serem deletadas.

```ts
import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("classes", (table) => {
    table.increments("id").primary();
    table.string("subject").notNullable();
    table.decimal("cost").notNullable();

    // Chave Estrangeira que permite relacionamento com a tabela 'users'
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("classes");
}
```

## Tabela de Agendamento das Aulas

Criar um arquivo '02_create_classes_schedules.ts', para armazenar as datas agendadas das aulas. Precisaremos fazer um relacionamento com a tabela 'classes', então teremos o campo 'class_id' como chave estrangeira para relacionar uma aula a um agendamento.

```ts
import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("class_schedule", (table) => {
    table.increments("id").primary();
    table.integer("week_day").notNullable();
    table.integer("from").notNullable();
    table.integer("to").notNullable();

    // Chave Estrangeira que permite relacionamento com a tabela 'classes'
    table
      .integer("class_id")
      .notNullable()
      .references("id")
      .inTable("classes")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("class_schedule");
}
```

## Tabela de Conexões

Criar um arquivo '03_create_connections.ts'. Aqui vamos armazenar dados caso um usuário apenas tente uma conexão com um professor. Teremos apenas dois campos, o id do professor (chave estrangeira) que o user tentou a conexão e a hora que isso ocorreu.

```ts
import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("connections", (table) => {
    table.increments("id").primary();

    // Chave Estrangeira que permite relacionamento com a tabela 'users'
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table
      .timestamp("created_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"))
      .notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("connections");
}
```

# Função para lidar com os Horários

O banco SQL não consegue armazenar informações com o formato de horas (ex: 8:00). Para resolver isso, vamos criar uma pasta 'utils' e um arquivo chamado 'convertHoursToMinutes.ts'. Nesse arquivo criaremos uma função que converte horas em minutos, assim conseguimos armazenar essa informação no banco de dados. Vamos utilizar essa função mais pra frente, quando formos de fato fazer as querys para inserção das informações no banco de dados.

Atráves da função de js 'split()' vamos dividir a hora onde tem os dois pontos (8:00) e retornar ela num array. Com o map vou passar por todos os itens e armazenar cada posição em uma variável, fazendo uma desestruturação de hour (para a primeira posição) e minutes (para segunda posição). Logo abaixo faço a conversão e armazeno o resultado na variável 'timeInMinutes'.

```ts
export default function convertHourToMinutes(time: string) {
  const [hour, minutes] = time.split(":").map(Number);
  const timeInMinutes = hour * 60 + minutes;
  return timeInMinutes;
}
```

# Controllers

Nossa aplicação gira em torno de duas entidades: aulas (classes) e conexões (connections). Para cada entidade, vamos fazer rotas para buscar (get) ou criar (post) alguma informação no banco de dados.

- Conexões

  - Rota para listar o total de conexões realizadas
  - Rota para criar uma nova conexão

- Aulas

  - Rota para criar uma aula
  - Rota para listar aulas (Filtrar por matéria, dia da semana e horário)

Na pasta 'src' vamos criar uma pasta 'controllers' e dois arquivos 'ClassesController.ts' e 'ConnectionController.ts'

## Controller de Aulas

No arquivo 'ClassesController.ts', nas primeiras linhas vamos importar o express, o banco de dados e nossa função criada 'convertHourToMinutes()'.

```ts
import { Request, Response } from "express";
import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";

// Interface que define o formato do ScheduleItem
interface scheduleItem {
  week_day: number;
  from: string;
  to: string;
}

// Cria a class ConnectionsController para englobar as querys
export default class ConnectionsController {
  // -------- Função que que lista as aulas filtradas --------
  async index(request: Request, response: Response) {
    const filters = request.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    // Nossa listagem só poderá ser feita caso tenha pelo menos um dos filtros.
    // Para isso vamos fazer um if para caso não existir esses filtros, retornamos um erro.
    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: "Missing filters to search classes",
      });
    }

    // Converte o horário enviado em minutos usando nossa função convertHourToMinutes()
    const timeInMinutes = convertHourToMinutes(time);

    // Agora vamos para a query de busca na tabela 'classes'.
    // Com umas funções do knex conseguimos fazer algumas comparações para buscar aquilo que foi filtrado.
    const classes = await db("classes")
      .whereExists(function Exists() {
        this.select("class_schedule.*") // seleciona todos os campos da tabela 'class_schedule'
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
          .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
          .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
          .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]);
      })
      .where("classes.subject", "=", subject)
      .join("users", "classes.user_id", "=", "users.id")
      .select(["classes.*", "users.*"]);

    return response.json(classes);
  }

  // -------- Função que que cria uma aula --------
  // Pega todas as informações do corpo da requisição e inserir cada uma em sua própria tabela.
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    } = request.body;

    // Com a função 'transaction()' as inserções serão feitas de uma só vez.
    // A inserção só é feita caso não dê erro em nenhuma delas.
    const trx = await db.transaction();

    // Agora vamos usar o 'try' para fazer a tentativa de inserção no banco de dados.
    // Colocamos as querys, que armazena os dados em suas respectivas tabelas.
    try {
      // Prepara a query de inserção na tabela 'users'
      const insertedUsersIds = await trx("users").insert({
        name,
        avatar,
        whatsapp,
        bio,
      });

      const user_id = insertedUsersIds[0];

      // Prepara a query de inserção na tabela 'classes'
      const insertedClassesIds = await trx("classes").insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedClassesIds;

      // A preparação da inserção do schedule vai ser um pouco diferente.
      // Como o schedule é um array de vários dados, antes de inserir precisamos fazer configurações.
      // Com a função map() vamos percorrer cada item do array e transformá-los em um objeto.
      const classSchedule = schedule.map((scheduleItem: scheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from), // utilizando a função criada
          to: convertHourToMinutes(scheduleItem.to), // utilizando a função criada
        };
      });

      // Agora sim podemos inserir o objeto 'classSchedule' na tabela 'class_schedule'
      await trx("class_schedule").insert(classSchedule);

      // Com todas as querys preparadas, o commit() faz as inserções nas tabelas.
      await trx.commit();

      // Se as inserções derem certo, retorna sucesso
      return response.status(201).json({
        success: "User create with success",
      });

      // Aqui fechamos o 'try' e chamamos o chatch que vai expor se deu erro.
    } catch (e) {
      // desfaz qualquer alteração no banco
      await trx.rollback();

      // retorna a mensagem de erro
      return response.status(400).json({
        error: "Unexpected error while creating new class",
      });
    }
  }
}
```

## Controller de Conexões

Vamos criar o arquivo 'ConnectionsController.ts'. Nas primeiras linhas vamos importar o express e o banco de dados. Depois vamos escrever duas funções, uma pra listar e outra para criar.

```ts
import { Request, Response } from "express";
import db from "../database/connection";

export default class ConnectionsController {
  // -------- Função que lista o total de conexões feitas --------
  async index(request: Request, response: Response) {
    const totalConnections = await db("connections").count("* as total");

    const { total } = totalConnections[0];

    return response.json({ total });
  }

  // -------- Função que cria uma conexão --------
  async create(request: Request, response: Response) {
    const { user_id } = request.body;

    await db("connections").insert({
      user_id,
    });

    return response.status(201).send("Sucesso");
  }
}
```

# Rotas

Na pasta 'src' vamos criar um arquivo 'routes.ts' que conterá a chamada das nossas rotas. Nas primeiras linhas, vamos fazer a importação do 'express' e também das duas classes que criamos, com nossos querys.

```ts
import express from "express";
import ClassesControlller from "./controllers/ClassesController";
import ConnectionsController from "./controllers/ConnectionsController";

const routes = express.Router();
const classesControllers = new ClassesControlller();
const connectionsController = new ConnectionsController();

routes.get("/classes", classesControllers.index);
routes.post("/classes", classesControllers.create);

routes.get("/connections", connectionsController.index);
routes.post("/connections", connectionsController.create);

export default routes;
```

## 📕 Licença

Todos os arquivos incluídos aqui, incluindo este _ README _, estão sob [Licença MIT](./LICENSE).
Criado por [Adriana Lima](https://github.com/dxwebster)
