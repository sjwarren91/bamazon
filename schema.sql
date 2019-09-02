DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price INT,
    stock_quantity INT
);