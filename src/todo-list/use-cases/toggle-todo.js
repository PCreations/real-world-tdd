import { toggle as toggleTodo } from "../domain/todo";

export const createToggleTodoUseCase = ({ todoRepository }) => async ({
  todoId,
}) => {
  const todo = await todoRepository.get({ todoId });
  const editedTodo = toggleTodo(todo);
  await todoRepository.save({ todo: editedTodo });
  return editedTodo;
};
