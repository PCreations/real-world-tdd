import faker from "faker";
import { create } from "../domain/todo";

export const createTestTodo = ({
  id = faker.random.uuid(),
  name = faker.random.words(3),
} = {}) => create({ id, name });
