const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertDBObjectToResponseObject = (dbObject) => {
  return {
    todoId: dbObject.id,
    Todo: dbObject.todo,
    Priority: dbObject.priority,
    Status: dbObject.status,
  };
};

app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const getTodoQuery = `
     SELECT * FROM todo WHERE status LIKE 'TO DO';`;
  const TodoArray = await db.all(getTodoQuery);
  response.send(
    TodoArray.map((eachArray) => convertDBObjectToResponseObject(eachArray))
  );
});

app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const getTodoQuery = `
     SELECT * FROM todo WHERE priority LIKE 'HIGH';`;
  const TodoArray = await db.all(getTodoQuery);
  response.send(
    TodoArray.map((eachArray) => convertDBObjectToResponseObject(eachArray))
  );
});

app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const getTodoQuery = `
     SELECT * FROM todo WHERE ;`;
  const TodoArray = await db.all(getTodoQuery);
  response.send(
    TodoArray.map((eachArray) => convertDBObjectToResponseObject(eachArray))
  );
});

app.post("/todos/", async (request, response) => {
  const { todoId, Todo, Priority, Status } = request.body;
  const postTodoQuery = `
    INSERT INTO todo (id, todo, priority, status)
    VALUES (${todoId}, '${Todo}', '${Priority}', '${Status}');`;
  const todo = await db.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

module.exports = app;
