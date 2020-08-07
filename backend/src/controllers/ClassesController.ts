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

    // Agora vamos converter o horário enviado em minutos usando nossa função convertHourToMinutes() armazenar num variável.
    const timeInMinutes = convertHourToMinutes(time);

    // Agora vamos para a query de busca na tabela 'classes'.
    // Com umas funções do knex conseguimos fazer algumas comparações para buscar aquilo que foi filtrado.
    const classes = await db("classes")
      .whereExists(function Exists() {
        this.select("class_schedule.*") // seleciona todos os campos da tabela 'class_schedule'
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id` = `classes`.`id`") // pesquisa todos os agendamentos que tem o class_id igual ao buscado
          .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)]) // pesquisa todos os agendamentos que o dia da semana for igual ao buscado
          .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes]) // pesquisa todos os agendamentos que tem horário menor ou igual ao buscado
          .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]); // pesquisa todos os agendamentos que que tem horário maior que o buscado
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

    // Precisamos agora usar uma função chamada 'transaction()' que prepara as inserções no banco.
    // A inserção só é feita caso não dê erro em nenhuma delas.
    const trx = await db.transaction();

    // Agora vamos usar o 'try' para fazer a tentativa de inserção no banco de dados.
    // Dentro dele colocamos nossas querys, que vai pegar determinados dados e inserir em suas respectivas tabelas.
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
      // Como o schedule é um array de vários dados, antes de inserir precisamos fazer algumas configurações.
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

      // Como estamos usando o transaction, todas as querys estão apenas esperando o commit para realmente rodarem.
      // Com todas as inserções preparadas, podemos fazer o commit() que faz as inserções nas tabelas.
      await trx.commit();

      // Se der certo as inserções, aparece a mensagem de confirmação
      return response.status(201).json({
        success: "Class create with success",
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
