import express from "express";
import morgan from "morgan";
import Joi from "joi";
import multer from "multer";

import pgPromise from "pg-promise";
import {
  create,
  createImage,
  deleteById,
  getAll,
  getOneById,
  updateById,
} from "./controllers/planets.js";
import { logIn } from "./controllers/users.js";

const app = express();
const port = 3001;

app.use(morgan("dev"));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // bisogna creare una cartella uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // nomina i file esattamente così come vengono inviati
  },
});
const upload = multer({ storage });

app.get("/", (request, response) => {
  response.status(200).json({ msg: "Hello World!" });
});

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.post("/api/planets/:id/image", upload.single("image"), createImage);

app.post("/api/users/login", logIn);

app.listen(port, () => {
  console.log(`Server in ascolto a http://localhost:${port}`);
});
