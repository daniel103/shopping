const express = require("express");
const app = express();

app.use(express.json());
app.use("/users", require("./routes/users.route"));
app.use("/products", require("./routes/products.route"));

app.get("/", (req, res) => {
  res.send("Shopping API");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
