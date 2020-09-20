import { createTestClient } from "apollo-server-testing";
import {
  createApolloServer,
  ADD_TODO_MUTATION,
} from "../../../adapters/graphql-api";
import { create as createTodo } from "../../../domain/todo";

describe("addTodoMutation", () => {
  it("correctly calls the add-todo use case", async () => {
    const nextTodoId = "todo42";
    const todoName = "do something";
    const addTodoUseCase = jest.fn().mockImplementationOnce(() => nextTodoId);

    const server = createApolloServer({ addTodo: addTodoUseCase });
    const { mutate } = createTestClient(server);

    // act
    const res = await mutate({
      mutation: ADD_TODO_MUTATION,
      variables: {
        name: todoName,
      },
    });

    // assert
    const expectedTodo = createTodo({
      id: "todo42",
      name: todoName,
    });
    expect(res.data.addTodo).toEqual(expectedTodo);
    expect(addTodoUseCase).toHaveBeenCalledWith({ name: todoName });
  });
});
