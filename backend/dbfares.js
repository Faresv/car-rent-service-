const sqlite = require('sqlite3');
const db = new sqlite.Database('car_rental.db', (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// User table for storing user data
const createUserTable = `
CREATE TABLE IF NOT EXISTS USER (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  NAME TEXT NOT NULL,
  EMAIL TEXT UNIQUE NOT NULL,
  PASSWORD TEXT NOT NULL,
  ISADMIN INT
)
`;

// Car table for storing car rental products and their prices
const createCarTable = `
CREATE TABLE IF NOT EXISTS CAR (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  MAKE TEXT NOT NULL,
  MODEL TEXT NOT NULL,
  YEAR INTEGER NOT NULL,
  PRICE_PER_DAY DECIMAL(10, 2) NOT NULL,
  AVAILABILITY_STATUS TEXT NOT NULL
)
`;

// Products table for storing rental accessories or additional services (e.g., GPS, child seats)
const createProductTable = `
CREATE TABLE IF NOT EXISTS PRODUCT (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  NAME TEXT NOT NULL,
  DESCRIPTION TEXT,
  PRICE DECIMAL(10, 2) NOT NULL,
  AVAILABILITY_STATUS TEXT NOT NULL
)
`;

// Cart table for storing cars and products added to the cart by the user
const createCartTable = `
CREATE TABLE IF NOT EXISTS CART (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  USER_ID INT,
  CAR_ID INT,
  PRODUCT_ID INT,
  QUANTITY INT NOT NULL,
  FOREIGN KEY (USER_ID) REFERENCES USER(ID),
  FOREIGN KEY (CAR_ID) REFERENCES CAR(ID),
  FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCT(ID)
)
`;

// Booking table for storing car rental bookings
const createBookingTable = `
CREATE TABLE IF NOT EXISTS BOOKING (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  USER_ID INT,
  CAR_ID INT,
  START_DATE TEXT NOT NULL,
  END_DATE TEXT NOT NULL,
  TOTAL_PRICE DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (USER_ID) REFERENCES USER(ID),
  FOREIGN KEY (CAR_ID) REFERENCES CAR(ID)
)
`;

// Create all tables when the script is executed
db.serialize(() => {
  db.run(createUserTable, (err) => {
    if (err) console.error("Error creating USER table:", err.message);
  });
  db.run(createCarTable, (err) => {
    if (err) console.error("Error creating CAR table:", err.message);
  });
  db.run(createProductTable, (err) => {
    if (err) console.error("Error creating PRODUCT table:", err.message);
  });
  db.run(createCartTable, (err) => {
    if (err) console.error("Error creating CART table:", err.message);
  });
  db.run(createBookingTable, (err) => {
    if (err) console.error("Error creating BOOKING table:", err.message);
  });
});

// Export the database connection and table creation scripts
module.exports = {
  db
};
