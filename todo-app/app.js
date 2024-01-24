/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended : false}));
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const { Todo } = require("./models");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine","ejs");
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_charecter_long",["PUT","DELETE"]))

app.get("/", async(request,response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")){
    response.render('todo',{
      allTodos,
      csrfToken: request.csrfToken(),
    });
    
  } else {
    response.json({
      allTodos
    })

  }
});

app.use(express.static(path.join(__dirname,'public')));

app.get("/todos", async (request, response) => {
  try {
    const todos = await Todo.findAll();
    return response.json(todos);

  } catch (error) {
    console.log(error);
    return response.status(422).json({ error: "Internal Server Error" });
  }
});

app.post("/todos", async (request, response) => {
  console.log("creating a todo", request.body);
  const {title , dueDate } = request.body
  try {
    const todo = await Todo.create({
      title: title,
      dueDate: dueDate,
      completed: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    // write a new function called set completion status
    const updateTodo = await todo.statusChange();
    return response.json(updateTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    // FILL IN YOUR CODE HERE
    try {
      const todo = await Todo.destroy({
        where: {
          id: request.params.id,
        },
      });
      response.send(todo ? true : false);
    } catch (error) {
      console.error(error);
      response.status(422).json({ error: "Internal Server Error" });
    }
});

module.exports = app;