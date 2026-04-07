DROP TABLE IF EXISTS stock;

CREATE TABLE stock (
  barcode TEXT PRIMARY KEY,
  brand TEXT,
  group_code TEXT NOT NULL,
  size TEXT NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_stock_group_code ON stock(group_code);
