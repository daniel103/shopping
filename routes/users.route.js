const router = require("express").Router();
const fs = require("fs");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const dataPath = "C:/Users/home/Desktop/Node-Demo/shopping/data";
const saltRounds = 10;

router.get("/all", (req, res) => {
  fs.readFile(`${dataPath}/users.json`, "utf-8", async (err, data) => {
    if (err) res.send("Something want wrong");
    const users = await JSON.parse(data);
    const usersWithoutPassword = users.map((user) => ({
      ...user,
      password: "*****",
    }));
    res.send(usersWithoutPassword);
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  fs.readFile(`${dataPath}/users.json`, "utf-8", async (err, data) => {
    if (err) res.send("Something went wrong");
    const users = await JSON.parse(data);
    const currUser = users.find((user) => user.username == username);
    if (!currUser) res.send("User doesn't exist");
    if (await bcrypt.compare(password, currUser.password)) {
      return res.send("Login successfully");
    }
    return res.send("Password doesn't match");
  });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  fs.readFile(`${dataPath}/users.json`, "utf-8", async (err, data) => {
    if (err) res.status(500).send("Something wrong");
    const users = await JSON.parse(data);
    const math = users.find((user) => user.username == username);
    if (math) return res.status(400).send("Username already exist");

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
      id: uuid.v4(),
      username,
      password: hashedPassword,
    };
    users.push(newUser);
    fs.writeFile(`${dataPath}/users.json`, JSON.stringify(users), (err) => {
      if (err) res.status(500).send("Something wrong");
      return res.status(201).send("New user created");
    });
  });
});

module.exports = router;
