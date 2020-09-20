import { createTestClient } from "apollo-server-testing";
import {
  createApolloServer,
  DELETE_TODO_MUTATION,
} from "../../../adapters/graphql-api";

describe("deleteTodo mutation", () => {
  it("deletes the correct todos and returns the deleted todo id", async () => {
    // arrange
    const todoIdToDelete = "todo42";
    const deleteTodoUseCase = jest.fn();
    const server = createApolloServer({ deleteTodo: deleteTodoUseCase });
    const { mutate } = createTestClient(server);

    // act
    const res = await mutate({
      mutation: DELETE_TODO_MUTATION,
      variables: {
        todoId: todoIdToDelete,
      },
    });

    // assert
    expect(res.data.deleteTodo).toEqual(todoIdToDelete);
    expect(deleteTodoUseCase).toHaveBeenCalledWith({ todoId: todoIdToDelete });
  });
});
