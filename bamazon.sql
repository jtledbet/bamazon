
DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
  id INTEGER(12) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(20) NOT NULL,
  department_name VARCHAR(20) NOT NULL,
  price DECIMAL(13, 4) NOT NULL,
  stock_quantity INTEGER(6),
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 	("apples", "produce", 0.25, 50),
        ("bananas (bunch)", "produce", 1.15, 25),
        ("oranges", "produce", 0.35, 50),
        ("plums", "produce", 0.45, 75),
        ("limes", "produce", 0.35, 100),
        ("hammers", "hardware", 9.95, 10),
        ("wrenches", "hardware", 7.75, 12),
        ("screwdrivers", "hardware", 4.99, 20),
        ("tape measures", "hardware", 3.75, 12),
        ("nails (box of 100)", "hardware", 3.75, 100);