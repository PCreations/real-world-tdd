import sqlite3 from "sqlite3";
import { createApolloServer } from "./todo-list/adapters/graphql-api";
import { createSqliteTodoRepository } from "./todo-list/adapters/todo-repository";
import * as useCasesFactory from "./todo-list/use-cases";

(async () => {
  const db = await new Promise((resolve, reject) => {
    const sqlLiteDb = new sqlite3.Database(":memory", (err) => {
      if (err) reject(err);
      else resolve(sqlLiteDb);
    });
  });
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS todos(
    id TEXT PRIMARY KEY,
    name TEXT,
    done BOOLEAN
)`,
      [],
      (err) => (err ? reject(err) : resolve())
    )
  );
  const todoRepository = createSqliteTodoRepository({ db });

  const server = createApolloServer({
    addTodo: useCasesFactory.createAddTodoUseCase({ todoRepository }),
    getTodoList: useCasesFactory.createGetTodoListUseCase({ todoRepository }),
    deleteTodo: useCasesFactory.createDeleteTodoUseCase({ todoRepository }),
    toggleTodo: useCasesFactory.createToggleTodoUseCase({ todoRepository }),
  });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})();
