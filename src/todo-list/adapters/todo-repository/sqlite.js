import { create as createTodo } from "../../domain/todo";

const mapTodoRowToTodo = (todoRow) =>
  createTodo({
    ...todoRow,
    done: Boolean(todoRow.done),
  });

const mapTodoToTodoRow = (todo) => ({
  ...todo,
  done: Number(todo.done),
});

export const createSqliteTodoRepository = ({ db }) => {
  return {
    async get({ todoId }) {
      return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM todos WHERE id = ?`;
        db.all(sql, [todoId], (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows.length === 0) {
            reject(new Error(`todo of id ${todoId} not found`));
          }
          resolve(mapTodoRowToTodo(rows[0]));
        });
      });
    },
    async getAll() {
      return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM todos`;
        db.all(sql, [], (err, rows) => {
          if (err) {
            reject(err);
          }
          const todos = [];
          rows.forEach((row) => {
            todos.push(mapTodoRowToTodo(row));
          });
          resolve(todos);
        });
      });
    },
    async add({ todo }) {
      return new Promise((resolve, reject) => {
        const todoRow = mapTodoToTodoRow(todo);
        const sql = `INSERT INTO todos (id, name, done) VALUES (?, ?, ?)`;
        db.run(sql, [todoRow.id, todoRow.name, todoRow.done], (err) =>
          err ? reject(err) : resolve(todoRow.id)
        );
      });
    },
    async save({ todo }) {
      return new Promise((resolve, reject) => {
        const sql = `
          UPDATE todos 
          SET name = ?,
              done = ?
          WHERE id = ?
        `;
        const todoRow = mapTodoToTodoRow(todo);
        db.run(sql, [todoRow.name, todoRow.done, todoRow.id], (err) =>
          err ? reject(err) : resolve()
        );
      });
    },
    async delete({ todoId }) {
      return new Promise((resolve, reject) => {
        const sql = `DELETE FROM todos WHERE id = ?`;
        db.run(sql, [todoId], (err) => (err ? reject(err) : resolve(todoId)));
      });
    },
    getNextTodoId() {
      return `todo${+new Date()}`;
    },
  };
};
