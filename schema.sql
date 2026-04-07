DROP TABLE IF EXISTS stock;

CREATE TABLE stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barcode TEXT NOT NULL,
  name TEXT,
  option_text TEXT,
  qty INTEGER NOT NULL DEFAULT 0,
  raw_json TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_barcode ON stock(barcode);
CREATE INDEX idx_stock_name ON stock(name);
