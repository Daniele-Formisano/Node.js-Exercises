import { log } from "console";
import { Request, Response } from "express";
import Joi from "joi";
import pgPromise from "pg-promise";

// Joi schema for planet validation
const planetSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(1).required(),
});

const planetSchema2 = Joi.object({
  name: Joi.string().min(1).required(),
});

const db = pgPromise()(
  "postgres://postgres:1234567890@localhost:5432/myserver"
);
console.log(db);

const setupDb = async () => {
  db.none(`
      DROP TABLE IF EXISTS planets;
    
      CREATE TABLE planets (
        id SERIAL NOT NULL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Jupiter')`);
};
setupDb();

const getAll = async (request: Request, response: Response) => {
  const planets = await db.many(`SELECT * FROM planets`);

  response.status(200).json(planets);
};
const getOneById = async (request: Request, response: Response) => {
  const { id } = request.params;
  const planet = await db.one(`SELECT * FROM planets WHERE id=$1`, Number(id));

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
  const { error } = planetSchema.validate(request.body);
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

export { getAll, getOneById, create, updateById, deleteById };
