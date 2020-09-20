import { createDeleteTodoUseCase } from "../use-cases";
import { createInMemoryTodoRepository } from "../adapters/todo-repository";
import { createTestTodo } from "./create-test-todo";

describe("deleteTodo", () => {
  it("deletes a todo from the todo list", async () => {
    // arrange
    const todos = [createTestTodo(), createTestTodo()];
    const todoRepository = createInMemoryTodoRepository({ todos });
    const expectedDeletedTodo = todos[0];
    const deleteTodo = createDeleteTodoUseCase({ todoRepository });

    // act
    await deleteTodo({ todoRepository, todoId: todos[0].id });

    // assert
    const todoList = await todoRepository.getAll();
    expect(todoList).not.toContainEqual(expectedDeletedTodo);
  });
});
