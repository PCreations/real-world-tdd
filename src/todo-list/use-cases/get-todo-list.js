export const createGetTodoListUseCase = ({ todoRepository }) => () =>
  todoRepository.getAll();
