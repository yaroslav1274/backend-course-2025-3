import { Command } from "commander";
import { readFileSync, writeFileSync, existsSync } from "fs";

const program = new Command();

program
  .requiredOption("-i, --input <path>", "Input JSON file")
  .option("-o, --output <path>", "Output file")
  .option("-d, --display", "Display result in console")
  .option("-f, --furnished", "Show only furnished houses")
  .option("-p, --price <number>", "Show only houses with price lower than given", parseFloat);

program.parse(process.argv);
const options = program.opts();

// Перевірка параметрів
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}
if (!existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читання JSON
const rawData = readFileSync(options.input, "utf8");
const lines = rawData.trim().split("\n").filter(Boolean);
const data = lines.map(line => JSON.parse(line));

// Фільтрація
let filtered = data;
if (options.furnished) {
  filtered = filtered.filter(h => h.furnishingstatus === "furnished");
}
if (options.price) {
  filtered = filtered.filter(h => Number(h.price) < options.price);
}

// Формування результату
const result = filtered.map(h => `${h.price} ${h.area}`).join("\n");

// Запис або вивід
if (options.output) {
  writeFileSync(options.output, result, "utf8");
}
if (options.display) {
  console.log(result);
}
