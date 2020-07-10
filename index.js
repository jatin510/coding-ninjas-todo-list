const express = require("express");

const path = require("path");
const app = express();
const port = 8000;

const db = require("./config/mongoose");
const Task = require("./models/task");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", require("./routes"));

app.use(express.urlencoded());
app.use(express.static("assets"));

// creating task  adn storing in the database
app.post("/create-task", (req, res) => {
  // pushing in database
  Task.create(
    {
      task: req.body.description,
      category: req.body.category,
      date: req.body.date,
    },
    function (err, tasks) {
      if (err) {
        console.log("Error in creating a task!");
        return;
      }

      // rerender the home page
      console.log("******", tasks);
      return res.redirect("back");
    }
  );
});

// delete task route
app.post("/delete-task", (req, res) => {
  console.log(req.body);

  let tasks = Object.keys(req.body);

  for (task of tasks) {
    // mongoose to delete the tasks
    Task.deleteOne({ _id: task }, function (err) {
      if (err) {
        console.log("Error in deleting from database.", err);
        return;
      }
    });
  }
  return res.redirect("back");
});

app.listen(port, function (err) {
  if (err) return console.log(`Error: ${err}`);

  console.log(`Server is running on port: ${port}`);
});
