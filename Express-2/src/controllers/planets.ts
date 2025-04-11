import { Request, Response } from "express";
import Joi from "joi";

type Planet = {
  id: number;
  name: string;
};

let planets: Planet[] = [
  { id: 1, name: "Earth" },
  { id: 2, name: "Mars" },
];

// Joi schema for planet validation
const planetSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(1).required(),
});

const getAll = (request: Request, response: Response) => {
  response.status(200).json(planets);
};
const getOneById = (request: Request, response: Response) => {
  const { id } = request.params;
  const planet = planets.find((p) => p.id === Number(id));

  if (!planet) {
    return response.status(404).json({ msg: "Planet not found!" });
  }

  response.status(200).json(planet);
};

const create = (request: Request, response: Response) => {
  // validazione con joi dei dati in arrivo
  const { error } = planetSchema.validate(request.body);
  if (error) {
    return response.status(400).json({ msg: error.details[0].message });
  }

  const { id, name } = request.body;
  const newPlanet: Planet = { id, name };
  planets = [...planets, newPlanet];

  response.status(201).json({ msg: "Added planet" });
};

const updateById = (request: Request, response: Response) => {
  // validazione con joi dei dati in arrivo
  const { error } = planetSchema.validate(request.body);
  if (error) {
    return response.status(400).json({ msg: error.details[0].message });
  }

  const { id } = request.params;
  const { name } = request.body;
  planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));

  response.status(200).json({ msg: "Planet updated" });
};

const deleteById = (request: Request, response: Response) => {
  const { id } = request.params;

  // Trova l'indice del pianeta con l'ID corrispondente
  const planetIndex = planets.findIndex((p) => p.id === Number(id));
  if (planetIndex === -1) {
    return response.status(404).json({ msg: "Planet not found!" });
  }

  planets = planets.filter((p) => p.id !== Number(id));

  response.status(200).json({ msg: "Planet deleted" });
};

export { getAll, getOneById, create, updateById, deleteById };
