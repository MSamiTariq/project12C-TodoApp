import React from "react";
import {useQuery, useMutation} from "@apollo/client";
import gql from 'graphql-tag';
import ErrorMsg from '../Utils/ErrorMessage';

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const TodoQuery = gql`{
  todo{ 
    title,
    id,
  }
}`

const addTodoMutation = gql`
  mutation addTodo($title: String!) {
    addTodo(title: $title) {
      title
    }
  }
`

const removeTodoMutation = gql`
  mutation removeTodo($id: ID!){
    removeTodo(id: $id) {
      id
    }
  }
`

const removeAllTodosMutation = gql`
  mutation removeAllTodos($id: ID){
    removeAllTodos(id: $id){
      id
    }
  }
`

const initialValues = {
  title: "",
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
});

export default function Home() {
  const {loading, data, error} = useQuery(TodoQuery);
  const [addTodo] = useMutation(addTodoMutation);
  const [removeTodo] = useMutation(removeTodoMutation);
  const [removeAll] = useMutation(removeAllTodosMutation);
  console.log("data", data);

  const addTodoSubmit = (values, actions) => {
    addTodo({
      variables: {
        title: values.title,
      },
      refetchQueries: [{ query: TodoQuery }],
    })

    actions.resetForm({
      values: {
        title: "",
      },
    });
  }

  const removeTodoSubmit = (id) => {
    console.log(id);
    removeTodo({
      variables: {
        id,
      },
      refetchQueries: [{ query: TodoQuery }],
    });
  };

  const removeAllTodos = () => {
    removeAll({
      variables: {},
      refetchQueries: [{ query: TodoQuery }],
    },
    )
  }


  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (<div className = "main">
    <div className = "form">
      <Paper elevation = {3} className = "paper">
      <h1 className = "heading1">Add Todo</h1>
      <Formik
              initialValues={initialValues}
              onSubmit={addTodoSubmit}
              validationSchema={validationSchema}
            >
              <Form className = "form">
                <Field
                  as={TextField}
                  id="Title"
                  type="text"
                  label="Todo"
                  variant="outlined"
                  name="title"
                  fullWidth
                  style={{ marginTop: "10px" }}
                />
                <ErrorMessage name="title" component={ErrorMsg} />

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  type="submit"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  Add Todo
                </Button>
              </Form>
            </Formik>
            </Paper>
    </div>

    <div className = "bookmarks">
      <div className = "bookmark-button">
      <h1 className= "heading2">Todos</h1>
      <Button variant = "outlined" color= "primary" className= "removeButton"
      onClick = {removeAllTodos}
      >Remove all</Button>
      </div>
        {data?.todo.map(todo => {
          return (
            <Container maxWidth="sm" key={todo.id}>
              <Typography
                className = "bookmark-container"
                component="div"
                style={{
                  backgroundColor: "#efefef",
                  maxWidth: "400px",
                  minWidth: "300px",
                  margin: "0 auto",
                  height: "80px",
                  marginTop: "10px",
                  borderRadius: "10px",
                  padding: "10px 15px",
                  overflow: "auto",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h3>{todo.title}</h3>
                  </div>
                  <div>
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeTodoSubmit(todo.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              </Typography>
            </Container>
          );
        })}
      </div>

    </div>);
}
