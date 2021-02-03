/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type todoInput = {
  title: string,
  id: string,
};

export type AddTodoMutationVariables = {
  todo: todoInput,
};

export type AddTodoMutation = {
  addTodo:  {
    __typename: "Todo",
    title: string,
    id: string,
  } | null,
};

export type RemoveTodoMutationVariables = {
  id: string,
};

export type RemoveTodoMutation = {
  removeTodo: string | null,
};

export type RemoveAllTodosMutation = {
  removeAllTodos: string | null,
};

export type UpdateTodoMutationVariables = {
  todo: todoInput,
};

export type UpdateTodoMutation = {
  updateTodo:  {
    __typename: "Todo",
    title: string,
    id: string,
  } | null,
};

export type GetTodosQuery = {
  getTodos:  Array< {
    __typename: "Todo",
    title: string,
    id: string,
  } > | null,
};
