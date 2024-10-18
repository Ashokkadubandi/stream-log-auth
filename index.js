const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dbPath = path.join(__dirname, "userData.db");
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

// POST request from user
app.post("/sign", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const id = uuidv4();
  console.log(typeof id);
  const query = `
    insert into userData(id,name,email,password)
    values('${id}','${name}','${email}','${password}')
  `;
  await db.run(query);
  res.send("Successfully Registered");
});

app.get("/data", async (req, res) => {
  res.send("data is valid");
});
