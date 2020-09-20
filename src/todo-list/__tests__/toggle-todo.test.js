import { createToggleTodoUseCase } from "../use-cases";
import { createInMemoryTodoRepository } from "../adapters/todo-repository";
import { createTestTodo } from "./create-test-todo";
import { toggle } from "../domain/todo";

describe("toggleTodo", () => {
  it("toggles the dodo 'done' state to true when it was fale", async () => {
    // arrange
    const todos = [createTestTodo(), createTestTodo()];
    const todoRepository = createInMemoryTodoRepository({ todos });
    const todoToToggle = todos[1];
    const toggleTodo = createToggleTodoUseCase({ todoRepository });

    // act
    await toggleTodo({ todoRepository, todoId: todoToToggle.id });

    // assert
    const todoList = await todoRepository.getAll();
    const editedTodo = todoList[1];
    expect(editedTodo.done).toBe(true);
  });
  it("toggles the dodo 'done' state to false when it was true", async () => {
    // arrange
    const todos = [createTestTodo(), toggle(createTestTodo())];
    const todoRepository = createInMemoryTodoRepository({ todos });
    const todoToToggle = todos[1];
    const toggleTodo = createToggleTodoUseCase({ todoRepository });

    // act
    const editedTodo = await toggleTodo({
      todoRepository,
      todoId: todoToToggle.id,
    });

    // assert
    expect(editedTodo.done).toBe(false);
  });
});
