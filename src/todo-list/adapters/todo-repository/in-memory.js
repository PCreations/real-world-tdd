import { create as createTodo } from "../../domain/todo";

export const createInMemoryTodoRepository = ({
  todos = [],
  getNextTodoId,
} = {}) => {
  let todoList = [...todos];
  return {
    async get({ todoId }) {
      const todoIndex = todoList.findIndex((todo) => todo.id === todoId);
      return createTodo(todoList[todoIndex]);
    },
    async getAll() {
      return todoList.map(createTodo);
    },
    async add({ todo }) {
      todoList = todoList.concat(todo);
      return todo.id;
    },
    async delete({ todoId }) {
      todoList = todoList.filter(({ id }) => id !== todoId);
    },
    async save({ todo }) {
      const todoIndex = todoList.findIndex(({ id }) => id === todo.id);
      todoList[todoIndex] = todo;
    },
    getNextTodoId() {
      return getNextTodoId();
    },
  };
};
