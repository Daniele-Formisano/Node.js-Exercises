import { EventEmitter } from "node:events";

function createNewsFeed() {
  const emitter = new EventEmitter();

  emitter.on("newsEvent", (data) => {
    console.log(data);
  });
  setInterval(() => {
    emitter.emit("newsEvent", "News: A thing happened in a place.");
  }, 1000);

  emitter.on("breakingNews", (data) => {
    console.log(data);
  });
  setInterval(() => {
    emitter.emit("breakingNews", "Breaking news! A BIG thing happened.");
  }, 4000);

  emitter.on("error", (data) => {
    console.log(data);
  });
  setTimeout(() => {
    emitter.emit("error", new Error("News feed connection error"));
  }, 5000);

  return emitter;
}

const newsFeed = createNewsFeed();
