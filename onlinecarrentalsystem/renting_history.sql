CREATE TABLE Renting_History (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  rent_date DATE NOT NULL,
  bond_amount DECIMAL(10, 2) NOT NULL
);
