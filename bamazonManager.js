var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "bamazon",
    port: 3306
});

connection.connect();
start();

function start(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?\n",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add new product"],
            name: "choices"
        }
    ]).then(function(ans){
        switch(ans.choices){
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowProducts();
                break;
            case "Add to Inventory":
                //something
            case "Add new product":
        }
    })
}

function viewProducts(){
    connection.query("SELECT item_id, product_name FROM products", function(err, res){
        if (err) throw err;
        console.table(res);
    })
}

function viewLowProducts(){
    connection.query("SELECT item_id, product_name FROM products WHERE stock_quantity<5", function(err, res){
        if (err) throw err;
        if(res.length > 0){
            console.table(res);
        } else {
            console.log("Stock levels okay.")
        }
    })
}

// function reStock(){
//     viewProducts();
//     inquirer.prompt([
//         {
//             type: "input",
//             message: "Enter id of item to re-stock.",
//             name: "item_id",
//             validate: function(input){
//                 if(isNaN(parseInt(input))){
//                     console.log("\nPlease enter a number.")
//                     return false;
//                 } else {
//                     return true;
//                 }
//             }
//         },

//         {
//             type: "input",
//             message: "How many would you like to add?",
//             name: "qty",
//             validate: function(input){
//                 if(isNaN(parseInt(input))){
//                     console.log("\nPlease enter a number.")
//                     return false;
//                 } else {
//                     return true;
//                 }
//             }
//         }
//     ]).then(function(ans){


//         connection.query("UPDATE stock_quantity")
//     })
// }