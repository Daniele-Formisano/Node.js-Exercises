import { log } from "node:console";
import * as fs from "node:fs";

fs.writeFile(
  "message.txt",
  "Questo è il contenuto del file appena creato!",
  (error) => {
    if (error) throw error;
    console.log("File creato con successo!");
  }
);
