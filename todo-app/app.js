const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

const saltRounds = 10;



app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
var csrf = require("csurf");
var cookieParser = require("cookie-parser");
const { where } = require("sequelize");
app.use(cookieParser("something"));
app.use(csrf({ cookie: true }));
// // app.js
// const { Sequelize } = require('sequelize')

// // Initialize and sync the model
// async function initializeModels() {
//   try {
//     await Todo.sync() // This will create the "Todos" table if it doesn't exist
//     console.log('Models synchronized successfully.')
//   } catch (error) {
//     console.error('Error synchronizing models:', error)
//   }
// }

// // Call the function to initialize models
// initializeModels()

// ... rest of your Express app setup

app.get("/", async (request, response) => {
  if (request.accepts("html")) {
    response.render("index", {
      csrfToken: request.csrfToken(),
    });
  }
});

app.get(
  "/todo",
  
  async (request, response) => {
    const user = request.user; 
    const allTodos = await Todo.getAllTodos(user.id);
    if (request.accepts("html")) {
      response.render("todo", {
        allTodos,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({ allTodos });
    }
  }
);

app.get("/signup", async (request, response) => {
  if (request.accepts("html")) {
    response.render("signup", {
      csrfToken: request.csrfToken(),
    });
  }
});

app.get("/login", async (request, response) => {
  response.render("login", { csrfToken: request.csrfToken() });
});

app.get(
  "/signout",
  async (request, response, next) => {
    request.logOut((err) => {
      if (err) {
        next(err);
      }
      response.redirect("/");
    });
  }
);

app.get(
  "/todos",
  async function (request, response) {
    try {
      const todo = await Todo.findAll(user.id);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);



app.post(
  "/todos",
  async function (request, response) {
    try {
      console.log(request.user.id);
      const todo = await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todo"), todo;
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);


app.put(
  "/todos/:id/markAsIncomplete",
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);

      if (!todo) {
        return response.status(404).json({ error: "Todo not found" });
      }

      const updatedTodo = await todo.markAsIncomplete();
      return response.json(updatedTodo);
    } catch (error) {
      console.error("Error marking todo as incomplete:", error);
      return response
        .status(422)
        .json({ error: "Failed to mark todo as incomplete" });
    }
  }
);

app.put(
  "/todos/:id",
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);

      if (!todo) {
        return response.status(404).json({ error: "Todo not found" });
      }

      const updatedTodo = await todo.markAsCompleted();
      return response.sendStatus(200);
    } catch (error) {
      console.error("Error marking todo as completed:", error);
      return response
        .status(422)
        .json({ error: "Failed to mark todo as completed" });
    }
  }
);

app.put(
  "/todos/:id/:x",
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      if (!todo) {
        return response.status(404).json({ error: "Todo not found" });
      }
      const updatedTodo = await todo.statusChange(request.params.x);
      console.log("done");
      return response.json(updatedTodo); // Return the updated todo object
    } catch (error) {
      console.error("Error marking todo as completed:", error);
      return response
        .status(422)
        .json({ error: "Failed to mark todo as completed" });
    }
  }
);

app.delete(
  "/todos/:id",
  async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    try {
      const todo = await Todo.remove(request.params.id);

      if (todo) {
        response.sendStatus(200);
      } else {
        response.status(422).json({ error: "Failed to delete the Todo" });
      }
    } catch (error) {
      console.error(error);
      response.status(422).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = app;