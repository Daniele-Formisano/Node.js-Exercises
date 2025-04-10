import express from "express";
import { log } from "node:console";
import morgan from "morgan";

const app = express();
const port = 3001;

type Planet = {
  id: number;
  name: string;
};

let planets: Planet[] = [
  { id: 1, name: "Earth" },
  { id: 2, name: "Mars" },
];

app.use(morgan("dev"));

app.get("/", (request, response) => {
  response.status(200).json({ msg: "Hello World!" });
});

app.get("/api/planets", (request, response) => {
  response.status(200).json(planets);
});

app.listen(port, () => {
  console.log(`Server in ascolto a http://localhost:${port}`);
});
