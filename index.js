const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dbPath = path.join(__dirname, "userData.db");
const bcrypt = require("bcrypt");
let port = process.env.PORT || 8000;
app.use(cors());
let db = null;
const initializeDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`https://localhost:${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

initializeDatabase();

app.use(express.json());

// POST request from user Register API
app.post("/sign", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const dbQuery = `select * from userData where name='${name}'`;
  const dbUser = await db.get(dbQuery);
  if (dbUser === undefined) {
    const id = uuidv4();
    const query = `
    insert into userData(id,name,email,password)
    values('${id}','${name}','${email}','${hashedPassword}')
  `;
    await db.run(query);
    res.send(`Created new user with ${name}`);
  } else {
    res.status(400);
    res.send("User name already exists please try another name");
  }
});

// POST request from user Login API

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const nameMatch = `select * from userData where name='${username}'`;
  const dbUser = await db.get(nameMatch);
  if (dbUser === undefined) {
    res.status(400);
    res.send("Invalid user");
  } else {
    const isPassMatch = await bcrypt.compare(password, dbUser.password);
    if (isPassMatch) {
      res.send([{ token: `LOGIN SUCCESS` }]);
    } else {
      res.status(400);
      res.send("Invalid Password");
    }
  }
});

app.get("/data", async (req, res) => {
  const query = `select * from userData`;
  let data = await db.get(query);
  res.send(data);
});
