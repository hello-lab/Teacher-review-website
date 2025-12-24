#!/usr/bin/env node
import { readFile } from "fs/promises";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { readFileSync, existsSync } from "fs";

function loadDotEnv() {
  // If MONGODB_URI is already set, do nothing
  if (process.env.MONGODB_URI) return;

  // Try to load .env from project root
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  try {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      // Remove surrounding quotes
      if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
    console.log("Loaded environment variables from .env");
  } catch (err) {
    // swallow error
    console.warn("Failed to read .env file:", err.message || err);
  }
}

async function main() {
  loadDotEnv();

  const argv = process.argv.slice(2);
  const drop = argv.includes("--drop") || argv.includes("-d");

  const mongoUri = process.env.MONGODB_URI;
  const mongoDb = process.env.MONGODB_DB || process.env.MONGODB_DATABASE || "test";

  if (!mongoUri) {
    console.error("Error: MONGODB_URI environment variable is not set.");
    console.error("Set it and re-run. Example (PowerShell): $env:MONGODB_URI='<your-uri>'; node scripts/upload-teachers.mjs");
    process.exitCode = 1;
    return;
  }

  const filePath = resolve(process.cwd(), "public", "teachers.json");

  try {
    const file = await readFile(filePath, "utf8");
    const docs = JSON.parse(file);

    if (!Array.isArray(docs)) {
      console.error("Expected an array of documents in public/teachers.json");
      process.exitCode = 1;
      return;
    }

    // If the JSON is an array of arrays (e.g. [ [name, image], [name, image] ])
    // convert to array of objects { name, image }
    let normalizedDocs = docs;
    if (docs.length > 0 && Array.isArray(docs[0])) {
      console.log("Detected array-of-arrays format in public/teachers.json — converting to objects...");
      normalizedDocs = docs.map((item) => {
        if (!Array.isArray(item)) return item;
        const [name, image, ...rest] = item;
  const doc = { name };
        if (image !== undefined) doc.image = image;
        // If there are more fields in the array, add them as f1, f2... to avoid data loss
        rest.forEach((val, idx) => {
          doc[`f${idx + 1}`] = val;
        });
        return doc;
      });
    }

  const client = new MongoClient(mongoUri);
    await client.connect();
  const db = client.db(mongoDb);
  const col = db.collection("teachers");
const result1 = await db.command({ ping: 1 });
    console.log("MongoDB connection successful:", result1);
    if (drop) {
      console.log("Dropping existing documents in collection 'teachers'...");
      await col.deleteMany({});
    }

    if (docs.length === 0) {
      console.log("No documents found in public/teachers.json — nothing to insert.");
      await client.close();
      return;
    }

  // Insert documents. If documents already contain _id fields that conflict, insertMany will fail.
  const result = await col.insertMany(normalizedDocs);
  console.log(`Inserted ${result.insertedCount} documents into ${mongoDb}.teachers`);

    await client.close();
  } catch (err) {
    console.error("Error:", err);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith("upload-teachers.mjs")) {
  main();
}
