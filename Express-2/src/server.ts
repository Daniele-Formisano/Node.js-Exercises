import express from "express";
import morgan from "morgan";
import Joi from "joi";
import {
  create,
  deleteById,
  getAll,
  getOneById,
  updateById,
} from "./controllers/planets";

const app = express();
const port = 3001;

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({ msg: "Hello World!" });
});

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.listen(port, () => {
  console.log(`Server in ascolto a http://localhost:${port}`);
});
