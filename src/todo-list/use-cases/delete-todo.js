export const createDeleteTodoUseCase = ({ todoRepository }) => async ({
  todoId,
}) => todoRepository.delete({ todoId });
