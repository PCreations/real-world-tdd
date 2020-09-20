import { ApolloServer, gql } from "apollo-server";
import { create as createTodo } from "../../domain/todo";

export const ADD_TODO_MUTATION = gql`
  mutation AddTodo($name: String!) {
    addTodo(name: $name) {
      id
      name
      done
    }
  }
`;

export const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodo($todoId: ID!) {
    deleteTodo(todoId: $todoId)
  }
`;

export const TOGGLE_TODO_MUTATION = gql`
  mutation ToggleTodo($todoId: ID!) {
    toggleTodo(todoId: $todoId) {
      id
      name
      done
    }
  }
`;

export const TODO_LIST_QUERY = gql`
  {
    todoList {
      id
      name
      done
    }
  }
`;

const typeDefs = gql`
  type Todo {
    id: ID!
    name: String!
    done: Boolean!
  }

  type Mutation {
    addTodo(name: String!): Todo!
    deleteTodo(todoId: ID!): ID!
    toggleTodo(todoId: ID!): Todo!
  }

  type Query {
    todoList: [Todo!]!
  }
`;

const resolvers = {
  Mutation: {
    async addTodo(_, { name }, { addTodo }) {
      const addedTodoId = await addTodo({ name });
      return createTodo({
        id: addedTodoId,
        name,
      });
    },
    async deleteTodo(_, { todoId }, { deleteTodo }) {
      await deleteTodo({ todoId });
      return todoId;
    },
    async toggleTodo(_, { todoId }, { toggleTodo }) {
      return toggleTodo({ todoId });
    },
  },
  Query: {
    todoList(_, __, { getTodoList }) {
      return getTodoList();
    },
  },
};

export const createApolloServer = ({
  addTodo,
  getTodoList,
  deleteTodo,
  toggleTodo,
} = {}) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: {
      addTodo,
      getTodoList,
      deleteTodo,
      toggleTodo,
    },
  });
};
