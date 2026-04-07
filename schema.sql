CREATE TABLE stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_code TEXT,
  product_name TEXT,
  option_value TEXT,
  qty INTEGER,
  price REAL,
  location TEXT,
  brand TEXT,
  raw_json TEXT,
  updated_at TEXT
);
