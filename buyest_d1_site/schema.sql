DROP TABLE IF EXISTS stock;

CREATE TABLE stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_code TEXT,
  product_name TEXT,
  option_value TEXT,
  qty INTEGER DEFAULT 0,
  price REAL DEFAULT 0,
  location TEXT,
  brand TEXT,
  raw_json TEXT,
  updated_at TEXT
);

CREATE INDEX idx_stock_product_code ON stock(product_code);
CREATE INDEX idx_stock_product_name ON stock(product_name);
CREATE INDEX idx_stock_option_value ON stock(option_value);