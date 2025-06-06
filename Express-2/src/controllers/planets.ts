import { log } from "console";
import { Request, Response } from "express";
import Joi from "joi";
import { db } from "../db.js";
// Joi schema for planet validation
const planetSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(1).required(),
});

const planetSchema2 = Joi.object({
  name: Joi.string().min(1).required(),
});

const getAll = async (request: Request, response: Response) => {
  const planets = await db.many(`SELECT * FROM planets`);

  response.status(200).json(planets);
};
const getOneById = async (request: Request, response: Response) => {
  const { id } = request.params;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1`,
    Number(id)
  );

  if (!planet) {
    return response.status(404).json({ msg: "Planet not found!" });
  }

  response.status(200).json(planet);
};

const create = async (request: Request, response: Response) => {
  const { name } = request.body;
  const newPlanet = { name };

  // validazione con joi dei dati in arrivo
  const { error } = planetSchema2.validate(request.body);
  if (error) {
    return response.status(400).json({ msg: error.details[0].message });
  }
  await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
  response.status(201).json({ msg: "Added planet" });
};

const updateById = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { name } = request.body;
  // validazione con joi dei dati in arrivo
  const { error } = planetSchema2.validate(request.body);
  if (error) {
    return response.status(400).json({ msg: error.details[0].message });
  }
  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [Number(id), name]);

  response.status(200).json({ msg: "Planet updated" });
};

const deleteById = async (request: Request, response: Response) => {
  const { id } = request.params;

  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));
  response.status(200).json({ msg: "Planet deleted" });
};

const createImage = async (request: Request, response: Response) => {
  console.log(request.file);
  const { id } = request.params;
  const filename = request.file?.path;

  if (filename) {
    db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, filename]);
    response.status(201).json({ msg: "File uploaded successfully" });
  } else {
    response.status(400).json({ msg: "Error uploading the file" });
  }
};

export { getAll, getOneById, create, updateById, deleteById, createImage };
