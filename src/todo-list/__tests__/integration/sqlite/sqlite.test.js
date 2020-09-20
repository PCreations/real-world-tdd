import sqlite3 from "sqlite3";
import { toggle } from "../../../domain/todo";
import { createTestTodo } from "../../create-test-todo";
import { createSqliteTodoRepository } from "../../../adapters/todo-repository/sqlite";

const runAsync = (db) => (sql, params) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, (err) => (err ? reject(err) : resolve()));
  });

const createTables = (db) =>
  runAsync(db)(`CREATE TABLE IF NOT EXISTS todos(
    id TEXT PRIMARY KEY,
    name TEXT,
    done BOOLEAN
)`);

const seedData = ({ db, todos }) => {
  return runAsync(db)(
    `INSERT INTO todos (id, name, done) VALUES ${todos
      .map(() => "(?, ?, ?)")
      .join(",")};`,
    todos.flatMap((todo) => [todo.id, todo.name, todo.done])
  );
};

const dropTables = (db) => runAsync(db)(`DROP TABLE IF EXISTS todos`);

describe.only("sqliteTodoRepository", () => {
  let db;
  beforeEach(async (done) => {
    db = await new Promise((resolve, reject) => {
      const sqlLiteDb = new sqlite3.Database(":memory", (err) => {
        if (err) reject(err);
        else resolve(sqlLiteDb);
      });
    });
    await dropTables(db);
    await createTables(db);
    done();
  });
  afterEach(async (done) => {
    db.close((err) => {
      if (err) throw err;
      done();
    });
  });
  it("gets all todos", async () => {
    const todos = [createTestTodo(), createTestTodo(), createTestTodo()];
    await seedData({ db, todos });
    const todoRepository = createSqliteTodoRepository({ db });

    const allTodos = await todoRepository.getAll();

    expect(allTodos).toEqual(todos);
  });
  it("returns empty todo list if there is no todos", async () => {
    const todoRepository = createSqliteTodoRepository({ db });

    const allTodos = await todoRepository.getAll();

    expect(allTodos).toEqual([]);
  });
  it("gets a todo by its id", async () => {
    const todos = [createTestTodo(), createTestTodo(), createTestTodo()];
    await seedData({ db, todos });
    const todoRepository = createSqliteTodoRepository({ db });

    const todo = await todoRepository.get({ todoId: todos[1].id });

    expect(todo).toEqual(todos[1]);
  });
  it("adds a todo", async () => {
    const todoRepository = createSqliteTodoRepository({ db });
    const todo = createTestTodo();

    const addedTodoId = await todoRepository.add({ todo });

    const addedTodo = await todoRepository.get({ todoId: addedTodoId });
    expect(addedTodo).toEqual(todo);
  });
  it("saves a todo", async () => {
    const todos = [createTestTodo(), createTestTodo(), createTestTodo()];
    await seedData({ db, todos });
    const todoRepository = createSqliteTodoRepository({ db });

    await todoRepository.save({ todo: toggle(todos[0]) });

    const editedTodo = await todoRepository.get({ todoId: todos[0].id });
    expect(editedTodo).toEqual(toggle(todos[0]));
  });
  it("deletes a todo", async () => {
    const todos = [createTestTodo(), createTestTodo(), createTestTodo()];
    await seedData({ db, todos });
    const todoRepository = createSqliteTodoRepository({ db });

    const deletedTodoId = await todoRepository.delete({ todoId: todos[0].id });

    const todoList = await todoRepository.getAll();
    expect(deletedTodoId).toEqual(todos[0].id);
    expect(todoList).not.toContainEqual(todos[0]);
  });
});
