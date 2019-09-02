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

start();

function start(){
    connection.connect();
    getAll();
}

function getAll(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        // console.log(res);
        console.table(res);
        buyItem();
    })
}

function buyItem(){
    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "Enter the ID of the item you would like to buy.",
            validate: function(input){
                if(isNaN(parseInt(input))){
                    console.log("\nPlease enter a valid ID.")
                    return false;
                } else {
                    return true;
                }
            }
        },

        {
            type: "input",
            name: "item_qty",
            message: "How many would you like?",
            validate: function(input){
                if(isNaN(parseInt(input))){
                    console.log("Please enter a number.")
                    return false;
                } else {
                    return true;
                }
            } 
        }
    ]).then(function(ans){
        connection.query("SELECT item_id FROM products", function(err, res){
            if (err) throw err;
            // console.log(res);
            var checkArray = []
            res.forEach(element => {
                checkArray.push(element.item_id);
            });

            if(checkArray.indexOf(parseInt(ans.item_id)) < 0){
                console.log(chalk.red.bold("\nThat item does not exist.\n"));
                getAll();
            } else {
                qtyCheck(ans.item_id);
                connection.end();
            }
        });
    })

}

function qtyCheck(ID){
    connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: ID}, function(err, res){
        if (err) throw err;
        console.log(res);
    })
}