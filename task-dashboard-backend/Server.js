const express = require("express");
const mysql = require("mysql2");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "Lovemom@4", // Replace with your MySQL password
  database: "TASK", // Replace with your MySQL database name
});

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/tasks", (req, res) => {
  const { name, status } = req.body;
  db.query(
    "INSERT INTO tasks (name, status) VALUES (?, ?)",
    [name, status],
    (err, result) => {
      if (err) throw err;
      const newTask = { id: result.insertId, name, status };
      io.emit("taskAdded", newTask);
      res.status(201).json(newTask);
    }
  );
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
