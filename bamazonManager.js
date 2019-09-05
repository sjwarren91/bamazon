var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var Table = require("cli-table");

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
            message: chalk.magenta.bold("What would you like to do?"),
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
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
                getIDs();
                break;
            case "Add New Product":
                addItem();
                break;
            case "Quit":
                connection.end();
                process.exit();
        }
    })
}

function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        var table = new Table({
            head:["Item ID", "Item Name", "Department", "Price", "Remaining Stock"],
            colWidths: [10, 25, 15, 10, 20]
        })

        res.forEach(el => {
            table.push([el.item_id, el.product_name, el.department_name, "$" + el.price, el.stock_quantity]);
        });

        console.log(table.toString() + "\n");

        start();
    });
}

function viewLowProducts(){
    connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity<5", function(err, res){
        if (err) throw err;
        if(res.length > 0){
            var table = new Table({
                head:["Item ID", "Item Name", "Remaining Stock"],
                colWidths: [10, 25, 20]
            })
    
            res.forEach(el => {
                table.push([el.item_id, el.product_name, el.stock_quantity]);
            });
    
            console.log(table.toString() + "\n");
        } else {
            console.log(chalk.green.bold("Stock levels okay.\n"))
        }
        start();
    })
}

function reStock(){
        inquirer.prompt([
            {
                type: "input",
                message: "Enter id of item to re-stock.\n",
                name: "item_id",
                validate: function(input){
                    if(isNaN(parseInt(input))){
                        console.log("\nPlease enter a number.")
                        return false;
                    } else {
                        return true;
                    }
                }
            },
    
            {
                type: "input",
                message: "How many would you like to add?",
                name: "qty",
                validate: function(input){
                    if(isNaN(parseInt(input))){
                        console.log("\nPlease enter a number.")
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ]).then(function(ans){
    
            connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: ans.item_id}, function(err, res){
                if (err) throw err;
                
                var newQty = res[0].stock_quantity + parseInt(ans.qty);
    
                connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newQty, ans.item_id], function(err, res){
                    if (err) throw err;
                    console.log(chalk.green.bold("\nStock replenished.\n"))
                    start();
                })
            })
        })
}

function getIDs(){
    connection.query("SELECT item_id, product_name FROM products", function(err, res){
        if (err) throw err;
        
        var table = new Table({
            head:["Item ID", "Item Name"],
            colWidths: [25, 25]
        })

        res.forEach(element => {
            table.push([element.item_id, element.product_name]);
        });

        console.log(table.toString());

        reStock();
    })
}

function addItem(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter item name.",
            name: "name"
        },

        {
            type: "input",
            message: "Enter item category.",
            name: "department"
        },

        {
            type: "input",
            message: "Enter item price.",
            name: "price",
            validate: function(input){
                if(isNaN(parseInt(input))){
                    console.log("\nPlease enter a number.")
                    return false;
                } else {
                    return true;
                }
            }
        },

        {
            type: "input",
            message: "Enter starting quantity",
            name: "qty",
            validate: function(input){
                if(isNaN(parseInt(input))){
                    console.log("\nPlease enter a number.")
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function(ans){
        var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) "
        query += "VALUES ('" + ans.name + "','" + ans.department + "'," + ans.price + "," + ans.qty + ")";
        console.log(query);
        
        connection.query(query, function(err, res){
            if (err) throw err;

            console.log(chalk.green.bold("\n" + ans.name + " added to stock.\n"));

            start();
        })
    })
}