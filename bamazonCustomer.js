var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var Table = require("cli-table")

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
            message: "What would you like to do?",
            choices: ["Buy", "Quit"],
            name: "choice"
        }
    ]).then(function(ans){

        switch(ans.choice){
            case "Buy":
                getAll();
                break;
            case "Quit":
                connection.end();
                process.exit();
        }

    });

}

function getAll(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        
        var table = new Table({
            head:["Item ID", "Item Name", "Department", "Price", "Stock"],
            colWidths: [10, 25, 15, 10, 10]
        })

        res.forEach(el => {
            table.push([el.item_id, el.product_name, el.department_name, "$" + el.price, el.stock_quantity]);
        });

        console.log(table.toString() + "\n");

        buyItem();
    });
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
                qtyCheck(ans.item_id, parseInt(ans.item_qty));
                
            }
        });
    });

}

function qtyCheck(ID, qty){
    connection.query("SELECT stock_quantity, price, product_sales FROM products WHERE ?", {item_id: ID}, function(err, res){
        if (err) throw err;
        
        if(res[0].stock_quantity - qty >= 0){
            var newQty = res[0].stock_quantity - qty;
            var cost = res[0].price * qty;
            console.log(cost);
            console.log(res[0].product_sales);
            var sales = res[0].product_sales + cost;
            console.log(chalk.green.bold("\nTransaction Successful!\n") + chalk.inverse("\nYour order totaled: $" + cost + "\n"));
            updateStock(ID, newQty, sales);
        } else {
            console.log(chalk.red.bold("\nInsufficient item stock.\n"));
            buyItem();
        }

    });
}

function updateStock(ID, newQty, sales){
    connection.query("UPDATE products SET stock_quantity=?, product_sales=? WHERE item_id=?", [newQty, sales, ID], function(err){
        if (err) throw err;
        start();
    });
}