
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