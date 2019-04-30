'use strict';

const mysql = require("mysql");
const { table } = require("table");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});


// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the afterConnection function after the connection is made to prompt the user
  // console.log("connected as id " + connection.threadId);
  
  console.log("Welcome to Bamazon!")
  displayMenu();
});

var totalCost = 0;

function displayMenu() {
  var query = "SELECT id, product_name, price FROM products"
  connection.query(query, function (err, res) {
    if (err) throw err;
    // console.log(res);

    // console.log(`id   product  price`);
    // for (i = 0; i < res.length; i++) {
    //   console.log(`${('0' + res[i].id).slice(-2)}   ${res[i].product_name}    ${res[i].price}`)
    // }


    console.table(res);

    var maxID = 0;
    for (var i = 0; i < res.length; i++) {
      if (res[i].id > maxID)
        maxID = res[i].id;
    }

    inquirer.prompt([
      {
        name: "productSelectionIndex",
        type: "input",
        message: "What would you like to purchase? (by ID) ",
        validate: function (value) {
          var valid = !isNaN(parseFloat(value));
          return valid || 'Please enter a number';
        },
      },
      {
        name: "desiredQuantity",
        type: "input",
        message: "How many would you like?",
        validate: function (value) {
          var valid = !isNaN(parseFloat(value));
          return valid || 'Please enter a number';
        },
      }
    ]).then(function (answers) {

      // console.log(answers);
      var productID = answers.productSelectionIndex;
      var desiredQuantity = answers.desiredQuantity;

      if (productID > maxID) {
        console.log ("Invalid product ID number. Quitting.")
        connection.end();
        return;
      }

      var query = ("SELECT product_name, stock_quantity FROM products WHERE id = " + productID)
        connection.query(query, function (err, res) {
          if (err) throw err;

          // console.log(res);
          // console.log(res[0].stock_quantity);
          var desiredProduct = res[0].product_name;
          var availableQuantity = res[0].stock_quantity;

          // Not enough of product in stock:
          if (desiredQuantity > availableQuantity) {
            console.log("Insufficient quantity available in stock!")
            console.log("Only " + availableQuantity + " " + desiredProduct + " remain.")
            buySomethingElse();
          } else {
            console.log("Okay! Let me go get your " + desiredProduct + ".");

            // Update stock quantities:
            var newQuantity = availableQuantity - desiredQuantity;
            var query = "UPDATE products SET stock_quantity = " + newQuantity + " WHERE id = " + productID;
            connection.query(query, function (err, res) {
              if (err) throw err;
            })

            // Calculate total cost:
            var query = "SELECT id, product_name, price FROM products"
            connection.query(query, function (err, res) {
              if (err) throw err;

              var unitPrice = res[productID - 1].price;
              var total = (unitPrice * desiredQuantity);


              total = roundMe(total)
              totalCost = parseFloat(totalCost) + parseFloat(total)
              totalCost = roundMe(totalCost)

              // console.log (unitPrice + " * " + desiredQuantity + " = " + total)
              console.log ("Your total purchase price was $" + total + ".");
              
              buySomethingElse();
            })
          };
        });
    });
  })
}  

function buySomethingElse () {
  console.log ("You have spent a total of $" + totalCost + ".");
  inquirer.prompt({
    name: "continue",
    type: "confirm",
    message: "Would you like to buy something else? ",
    default: true
  }).then(function (answer) {
    // console.log(answer)
    if (answer.continue) {
      displayMenu();
    }
    else {
      console.log("Thank you for shopping with Bamazon!")
      connection.end();
      return;
    }
  })
}

function roundMe(num) {
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}