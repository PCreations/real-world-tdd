import { createTestClient } from "apollo-server-testing";
import { createTestTodo } from "../../create-test-todo";
import {
  createApolloServer,
  TOGGLE_TODO_MUTATION,
} from "../../../adapters/graphql-api";
import { toggle } from "../../../domain/todo";

describe("addTodoMutation", () => {
  it("correctly calls the add-todo use case", async () => {
    const todoToToggle = createTestTodo();
    const toggleTodoUseCase = jest
      .fn()
      .mockResolvedValueOnce(toggle(todoToToggle));

    const server = createApolloServer({ toggleTodo: toggleTodoUseCase });
    const { mutate } = createTestClient(server);

    // act
    const res = await mutate({
      mutation: TOGGLE_TODO_MUTATION,
      variables: {
        todoId: todoToToggle.id,
      },
    });

    // assert
    const expectedTodo = toggle(todoToToggle);
    expect(res.data.toggleTodo).toEqual(expectedTodo);
    expect(toggleTodoUseCase).toHaveBeenCalledWith({ todoId: todoToToggle.id });
  });
});
