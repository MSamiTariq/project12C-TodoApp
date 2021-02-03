import React, { useState, useEffect, useRef } from "react"
import ErrorMsg from "../Utils/ErrorMessage"

import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import DeleteIcon from "@material-ui/icons/Delete"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

import { getTodos } from "../graphql/queries"
import {
  addTodo,
  removeTodo,
  removeAllTodos,
  updateTodo,
} from "../graphql/mutations"
import { API } from "aws-amplify"

var shortid = require("shortid")
const initialValues = {
  title: "",
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
})

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

export default function Home() {
  const [incomingData, setIncomingData] = useState()
  const [loading, setLoading] = useState(true)
  const [identity, setIdentity] = useState()
  const updateTitle = useRef(null)
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const addTodoSubmit = async (values, actions) => {
    const todo = {
      title: values.title,
      id: shortid.generate(),
    }
    const data = await API.graphql({
      query: addTodo,
      variables: {
        todo: todo,
      },
    })

    fetchTodos()

    actions.resetForm({
      values: {
        title: "",
      },
    })
  }

  const removeTodoSubmit = async id => {
    const data = await API.graphql({
      query: removeTodo,
      variables: {
        id: id,
      },
    })
    fetchTodos()
  }

  const removeAlltodos = async () => {
    const data = await API.graphql({
      query: removeAllTodos,
      variables: {},
    })

    fetchTodos()
  }

  const fetchTodos = async () => {
    console.log("fetch started")
    setLoading(true)
    const data = await API.graphql({
      query: getTodos,
    })
    console.log(data)
    setLoading(false)
    setIncomingData(data.data)
    console.log(incomingData)
  }

  const updateHandle = async () => {
    console.log(updateTitle.current.value)
    console.log(identity)
    const todo = {
      title: updateTitle.current.value,
      id: identity,
    }
    const data = await API.graphql({
      query: updateTodo,
      variables: {
        todo: todo,
      },
    })

    fetchTodos()
  }

  useEffect(() => {
    fetchTodos()
  }, [])

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
    )
  }

  return (
    <div className="main">
      <div className="form">
        <Paper elevation={3} className="paper">
          <h1 className="heading1">Add Todo</h1>
          <Formik
            initialValues={initialValues}
            onSubmit={addTodoSubmit}
            validationSchema={validationSchema}
          >
            <Form className="form">
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

      <div className="bookmarks">
        <div className="bookmark-button">
          <h1 className="heading2">Todos</h1>
          <Button
            variant="outlined"
            color="primary"
            className="removeButton"
            onClick={removeAlltodos}
          >
            Remove all
          </Button>
        </div>
        {incomingData &&
          incomingData.getTodos.map(todo => {
            return (
              <Container maxWidth="sm" key={todo.id}>
                <Typography
                  className="bookmark-container"
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
                      <button
                        type="button"
                        onClick={() => {
                          setIdentity(todo.id)
                          handleOpen()
                        }}
                      >
                        UPDATE
                      </button>
                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                      >
                        <Fade in={open}>
                          <div className={classes.paper}>
                            <input
                              id="outlined-helperText"
                              type="text"
                              label="Update"
                              variant="outlined"
                              placeholder="Title"
                              ref={updateTitle}
                            />
                            <button
                              onClick={() => {
                                updateHandle()
                                handleClose()
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </Fade>
                      </Modal>
                    </div>
                  </div>
                </Typography>
              </Container>
            )
          })}
      </div>
    </div>
  )
}
