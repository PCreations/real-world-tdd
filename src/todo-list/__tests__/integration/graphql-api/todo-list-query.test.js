import { createTestClient } from "apollo-server-testing";
import { createTestTodo } from "../../create-test-todo";
import {
  createApolloServer,
  TODO_LIST_QUERY,
} from "../../../adapters/graphql-api";

describe("todoList query", () => {
  it("gets the correct todos", async () => {
    // arrange
    const todos = [createTestTodo(), createTestTodo(), createTestTodo()];
    const getTodoListUseCase = jest.fn().mockResolvedValueOnce(todos);
    const server = createApolloServer({ getTodoList: getTodoListUseCase });
    const { query } = createTestClient(server);

    // act
    const res = await query({
      query: TODO_LIST_QUERY,
    });

    // assert
    expect(res.data.todoList).toEqual(todos);
  });
});
