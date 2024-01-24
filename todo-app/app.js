/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
app.use(
  session({
    secret: "helloworld0992766237857235",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await Users.findOne({
          where: {
            email: username,
          },
        });

        if (!user) {
          return done(null, false, { message: "Invalid User" });
        }

        const result = await bcrypt.compare(password, user.password);

        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const { Todo, Users } = require("./models");
const connectEnsureLogin = require("connect-ensure-login");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_charecter_long", ["PUT", "DELETE"]));

app.get("/", async (request, response) => {
  if (request.accepts("html")) {
    response.render("index", {
      csrfToken: request.csrfToken(),
    });
  } else {
    response.send("Bokada");
  }
});
app.get("/login", (request, response) => {
  response.render("login", { csrfToken: request.csrfToken() });
});

app.get("/signup", (request, response) => {
  response.render("signup", { csrfToken: request.csrfToken() });
});

app.post("/session", (request, response, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (!user) {
      console.log("Authentication failed:", info.message);
      return response.redirect("/login");
    }
    request.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      console.log("Authenticated user:", user);
      return response.redirect("/todo");
    });
  })(request, response, next);
});

// app.get("/todos", async (request, response) => {
//   try {
//     const todos = await Todo.findAll({
//       where: {
//         userId: request.user.id,
//       },
//     });
//     return response.json(todos);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json({ error: "Internal Server Error" });
//   }
// });

app.get(
  "/todo",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Session user:", request.user); // Log the user from the session
    const allTodos = await Todo.getTodos(request.user.id);
    response.render("todo", {
      allTodos,
      csrfToken: request.csrfToken(),
    });
  }
);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.post("/users", async (request, response) => {
  const { firstName, lastName, email, password } = request.body;
  const securePass = await bcrypt.hash(password, saltRounds);
  const user = await Users.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: securePass,
  });
  response.redirect("/todo");
});

app.post("/todos", async (request, response) => {
  console.log("creating a todo", request.body);
  const { title, dueDate } = request.body;
  try {
    const todo = await Todo.create({
      title: title,
      dueDate: dueDate,
      completed: false,
      userId: request.user.id,
    });
    return response.status(200).redirect("todo");
  } catch (error) {
    console.log(error);
    return response.status(422).send("some error");
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

app.get(
  "/signout",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    request.logOut((err) => {
      if (err) {
        return next(err);
      }
      response.redirect("/");
    });
  }
);

module.exports = app;
