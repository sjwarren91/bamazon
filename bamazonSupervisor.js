var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
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
            choices: ["View Product Sales Department", "Create New Department", "Quit"],
            message: chalk.magenta.bold("What would you like to do?"),
            name: "choice"
        }
    ]).then(ans => {
        switch(ans.choice){
            case "View Product Sales Department":
                productSales();
                break;
            case "Create New Department":
                createDepartment();
                break;
            case "Quit":
                connection.end();
                process.exit();
        }
    })
}

function productSales(){
    var query = "SELECT d.department_id, d.department_name, d.overhead_costs, SUM(p.product_sales) AS product_sales"
    query += ", (SUM(p.product_sales)-d.overhead_costs) AS total_profit "
    query += "FROM departments AS d "
    query += "LEFT JOIN products AS p " //need to see if I can set a default for SELECT statements
    query += "ON d.department_name = p.department_name "
    query += "GROUP BY department_name "
    query += "ORDER BY department_id"
    connection.query(query, function(err, res){
        if(err) throw err;

        var table = new Table({
            head:["ID", "Department", "Overheads", "Sales", "Profit"],
            colWidths: [10, 20, 15, 10, 10]
        })

        res.forEach(el => {
            table.push([el.department_id, el.department_name, "$" + el.overhead_costs, "$" + el.product_sales, "$" + el.total_profit]);
        });

        console.log(table.toString());

        start();
    })
}

function createDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter department name.",
            name: "name",
        },

        {
            type: "input",
            message: "Enter overhead costs",
            name: "cost",
            validate: function(input){
                if(isNaN(parseInt(input))){
                    console.log("\nPlease enter $ value.")
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function(ans){

        var query = "INSERT INTO departments (department_name, overhead_costs) ";
        query += "VALUES ('" + ans.name + "', " + ans.cost + ")";

        connection.query(query, function(err, res){
            if (err) throw err;

            console.log("Department '" + ans.name + "' added to records.")
            start();
        })
    })

}