const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const uuid = require("uuid");

const dataJson = "C:/Users/home/Desktop/Node-Demo/shopping/data"

router.get("/", (req, res) => {
  res.send("Hello im from product route");
});

router.get("/hey", (req, res) => {
  res.send("hey")
})

router.get("/all", (req, res) => {
  fs.readFile(`${dataJson}/products.json`, "utf-8", async (err, data) => {
    if(err) res.send("Something want wrong");
    const users = await JSON.parse(data);
    res.send(users);
  })
  console.log("test")
})

router.get("/category", (req, res) => {
  fs.readFile(`${dataJson}/products.json`, "utf-8", async (err, data) => {
    if(err) res.send("Something want wrong");
    console.log(dataJson)
  const JsonData = await JSON.parse(data);
    const category = JsonData.map(item => item.category)
    res.send(category);
  })
})

router.get("/price", (req, res) => {
  fs.readFile(`${dataJson}/products.json`, "utf-8", async (err, data) => {
    const price = await JSON.parse(data);
    const filterPrice = price.filter((p) => p.price >= req.query.price)
    if (err) res.send("wrong");
    res.send(filterPrice);
  })
})

router.post("/create", (req, res) => {
  fs.readFile(`${dataJson}/products.json`, "utf-8", async (err, data) => {
    if(err) res.send("Something want wrong");
    const dataProducts = await JSON.parse(data);
    const newProduct = {
      id: uuid.v4(),
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity
    }
    dataProducts.push(newProduct);

    fs.writeFile(`${dataJson}/products.json`, JSON.stringify(dataProducts), (err) => {
      if(err) res.send("Something want wrong");
      res.send("New Product Created Successfully");
    })
  })
})

router.put("/update/:id", (req, res) => {
  fs.readFile(`${dataJson}/products.json` , "utf-8", async (err, data) => {
    let updateProduct = await JSON.parse(data);
    const update = updateProduct.findIndex((product) => product.id = req.params.id);
    if (update < 0) {
      return res.status(400).send("wrong update");
    }
    updateProduct[update].name = req.body.name
    updateProduct[update].category = req.body.category
    updateProduct[update].price = req.body.price
    updateProduct[update].quantity = req.body.quantity

    fs.readFile(`${dataJson}/products.json`, JSON.stringify(updateProduct), (err) => {
      if(err) res.send("try again");
      res.send("update Product Successfully");
    })
  })
})

router.delete("/delete/:id", (req, res) => {
  fs.readFile(`${dataJson}/products.json`, "utf-8", async (err, data) => {
    if(err) res.send("Some thing went wrong");
    const deleteData = await JSON.parse(data);
    const Delete = deleteData.filter((product) => product.id != req.params.id);
    fs.writeFile(`${dataJson}/products.json`, JSON.stringify(Delete), err => {
      if (err) res.send("The delete didn't work");
      res.send("Deleted Successfully!");
    })
  })
})

module.exports = router;
