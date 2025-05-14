import exp from "constants";
import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:12345@localhost:5432/myserver");
console.log(db);

const setupDb = async () => {
  db.none(`DROP TABLE IF EXISTS planets;`);
  db.none(`DROP TABLE IF EXISTS users`);
  db.none(` CREATE TABLE planets (
          id SERIAL NOT NULL PRIMARY KEY,
          name TEXT NOT NULL,
          image TEXT
        )`);
  db.none(`
        CREATE TABLE users (
        id SERIAL NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        token TEXT
        ) `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Jupiter')`);
  await db.none(
    `INSERT INTO users (username, password) VALUES ('dummy', 'dummy')`
  );
};
setupDb();

export { db };
