import { createAddTodoUseCase } from "../use-cases";
import { createInMemoryTodoRepository } from "../adapters/todo-repository";
import { createTestTodo } from "./create-test-todo";
import { create as createTodo } from "../domain/todo";

describe("addTodo", () => {
  it("adds a todo in the todo list", async () => {
    // arrange
    const todos = [createTestTodo(), createTestTodo()];
    const nextTodoId = "todo42";
    const todoRepository = createInMemoryTodoRepository({
      todos,
      getNextTodoId: () => nextTodoId,
    });
    const addTodo = createAddTodoUseCase({ todoRepository });

    // act
    const addedTodoId = await addTodo({
      todoRepository,
      name: "some todo name",
    });

    // assert
    const todoList = await todoRepository.getAll();
    expect(addedTodoId).toEqual("todo42");
    expect(todoList).toContainEqual(
      createTodo({
        id: nextTodoId,
        name: "some todo name",
      })
    );
  });
});
