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
                qtyCheck(ans.item_id, parseInt(ans.item_qty));
                
            }
        });
    })

}

function qtyCheck(ID, qty){
    connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: ID}, function(err, res){
        if (err) throw err;
        
        if(res[0].stock_quantity - qty >= 0){
            var newQty = res[0].stock_quantity - qty;
            updateStock(ID, newQty);
        } else {
            console.log(chalk.red.bold("\nInsufficient item stock.\n"));
            buyItem();
        }

    })
}

function updateStock(ID, newQty){
    connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newQty, ID], function(err){
        if (err) throw err;
        console.log("Ending...")
        connection.end();
    })
}