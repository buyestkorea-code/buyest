function detectDelimiter(sample) {
  const firstLine = sample.split(/\r?\n/).find(line => line.trim() !== "") || "";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (tabCount >= commaCount && tabCount >= semiCount) return "\t";
  if (semiCount > commaCount) return ";";
  return ",";
}

function parseCSVLine(line, delimiter) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseCSV(text) {
  const cleaned = text.replace(/\uFEFF/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const delimiter = detectDelimiter(cleaned);

  const lines = cleaned
    .split("\n")
    .map(v => v.trim())
    .filter(v => v !== "");

  if (lines.length < 2) {
    throw new Error("CSV 데이터가 부족합니다.");
  }

  const headers = parseCSVLine(lines[0], delimiter).map(v => v.trim().toLowerCase());

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i], delimiter);
    if (cols.every(v => String(v).trim() === "")) continue;

    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (cols[j] || "").trim();
    }
    rows.push(row);
  }

  if (!rows.length) {
    throw new Error("CSV 데이터 행이 없습니다.");
  }

  return rows;
}