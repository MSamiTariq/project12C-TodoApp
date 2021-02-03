/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addTodo = /* GraphQL */ `
  mutation AddTodo($todo: todoInput!) {
    addTodo(todo: $todo) {
      title
      id
    }
  }
`;
export const removeTodo = /* GraphQL */ `
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;
export const removeAllTodos = /* GraphQL */ `
  mutation RemoveAllTodos {
    removeAllTodos
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo($todo: todoInput!) {
    updateTodo(todo: $todo) {
      title
      id
    }
  }
`;
