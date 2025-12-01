CREATE TABLE tables (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE menu_items (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), description TEXT, price DECIMAL(10,2), image_url VARCHAR(255), category VARCHAR(50));
CREATE TABLE orders (id INT AUTO_INCREMENT PRIMARY KEY, table_id INT, status ENUM('new','cooking','done') DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, menu_item_id INT, quantity INT, note VARCHAR(255));

INSERT INTO tables (name) VALUES ('Bàn 1'),('Bàn 2'),('Bàn 3');
INSERT INTO menu_items (name, description, price, image_url, category) VALUES
('Trà sữa trân châu','Trà sữa thơm ngon',30000,'https://via.placeholder.com/150','Thức uống'),
('Mì xào bò','Mì xào bò ngon',50000,'https://via.placeholder.com/150','Món chính'),
('Bánh mì ốp la','Bánh mì kẹp trứng',20000,'https://via.placeholder.com/150','Ăn sáng');
