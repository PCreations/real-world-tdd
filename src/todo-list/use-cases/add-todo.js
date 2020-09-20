import { create } from "../domain/todo";

export const createAddTodoUseCase = ({ todoRepository }) => async ({
  name,
}) => {
  const id = await todoRepository.getNextTodoId();
  const todo = create({
    id,
    name,
  });
  return todoRepository.add({ todo });
};
