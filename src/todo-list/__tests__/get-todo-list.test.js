import { createInMemoryTodoRepository } from "../adapters/todo-repository";
import { createTestTodo } from "./create-test-todo";
import { createGetTodoListUseCase } from "../use-cases";

describe("getTodoList", () => {
  it("gets all the todos", async () => {
    // arrange
    const todos = [createTestTodo(), createTestTodo(), createTestTodo()];
    const todoRepository = createInMemoryTodoRepository({ todos });
    const getTodoList = createGetTodoListUseCase({ todoRepository });

    // act
    const todoList = await getTodoList();

    // assert
    expect(todoList).toEqual(todos);
  });
});
