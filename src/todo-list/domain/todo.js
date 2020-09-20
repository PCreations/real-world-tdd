export const create = ({ id, name, done = false } = {}) =>
  Object.freeze({
    id,
    name,
    done,
  });

export const toggle = (todo = create()) =>
  create({
    ...todo,
    done: !todo.done,
  });
