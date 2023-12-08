import "dotenv/config";
import fs from "fs/promises";
import express from "express";
import Joi from "joi";
import cors from "cors";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import {
  deleteCharacter,
  editCharacter,
  getAllCharacters,
  getCharacter,
  saveCharacter,
  setup,
  setup2,
} from "./utils/filestorage.js";
import { v4 } from "uuid";

const PORT = process.env.PORT;
const app = express();
const storage = multer.memoryStorage();
const DIR = "./uploads/";
const upload = multer({ dest: DIR });
setup();
setup2();

app.use(cors());
app.use(express.json()); // -> bodyparser für application/json
app.use("/uploads", express.static("uploads"));

app.get("/api/characters", (req, res) => {
  getAllCharacters()
    .then((data) => res.json(data))
    .catch(() => res.status(500).end());
});
const characterSchema = Joi.object({
  name: Joi.string().trim().required(),
  level: Joi.number().integer().min(0).max(10),
  universe: Joi.string().required(),
  race: Joi.string(),
  superpower: Joi.string().lowercase(),
  herovillain: Joi.string(),
  imglink: Joi.binary(),
});

app.post("/api/characters", upload.single("imglink"), (req, res) => {
  let character = req.body;

  const { error, value } = characterSchema.validate(character);
  if (error) {
    console.log(error.message);
    res.status(418).json({ message: error.message });
    return;
  }
  character = value;
  // fileTypeFromBuffer(req.file.buffer)
  //   .then((data) => {
  //     const path = DIR + v4() + "." + data.ext;
  //     console.log("Path=>", path);
  //     console.log("buffer=>", req.file.buffer);
  //     fs.writeFile(path, req.file.buffer);
  //     return path;
  //   })
  // .then((data) => {
  character.imglink = req.file.path;
  // console.log("data=>", data);
  console.log("Wir checken unseren Character", character);
  saveCharacter(character);
  res.end();
});
// .catch((err) => res.status(500).end(err));
// });
app.delete("/api/characters", upload.single("imglink"), (req, res) => {
  const id = req.body.id;
  console.log("********** id=>", id);
  deleteCharacter(id)
    .then(() => res.end())
    .catch((err) => res.status(500).end(err));
});

app.put("/api/characters", upload.single("imglink"), (req, res) => {
  console.log("Ich bin da");
  console.log(req.body);
  const newCharacter = req.body;
  if (req.file) {
    console.log("Von app.js=> ", req.file.path);
    newCharacter.imglink = req.file.path;
  }
  editCharacter(newCharacter)
    .then(() => res.end())
    .catch((err) => {
      console.log(err);
      res.status(500).end("message");
    });
});

app.get("/api/characters/:id", (req, res) => {
  const { id } = req.params;
  console.log("get id");
  getCharacter(id)
    .then((item) => {
      console.log(item);
      res.json(item);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

app.listen(PORT, () => console.log(PORT));
