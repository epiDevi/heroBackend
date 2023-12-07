import fs from "fs/promises";
import fsystem from "fs";
import { v4 } from "uuid";
import { log } from "console";
const DB = "storage";

export function setup() {
  fs.access("./" + DB + "/")
    .then(() => console.log("Der Storage Ordner ist schon vorhanden"))
    .catch(() => {
      fs.mkdir("./" + DB);
    });
}

export function setup2() {
  fs.access("./uploads/")
    .then(() => console.log("Der Uploads Ordner ist schon vorhanden"))
    .catch(() => fs.mkdir("./uploads"));
}

// Als Parameter übergeben wir ein Object welches die properties unseres Characters enthält race universe imglink name superpower
export function saveCharacter(
  character = {
    race: "human",
    name: "batman",
    universe: "DC",
    superpower: "money",
  }
) {
  character.id = v4();
  console.log("data von Save ====>", character);
  fs.writeFile("./" + DB + "/" + character.id, JSON.stringify(character));
}

// Lese alle Dateien im Ordner storage ein und gebe uns diese als array mit objekten zurück
export function getAllCharacters() {
  return fs.readdir("./" + DB).then((files) => {
    const arr = [];
    for (const file of files) {
      // const data = fsystem.readFileSync('./' + DB + '/' + file)
      // const char = JSON.parse(data)
      // arr.push(char)
      // Das ist das selbe wie hier unten
      arr.push(JSON.parse(fsystem.readFileSync("./" + DB + "/" + file)));
    }
    return arr;
  });
}
// wir holen uns die daten von genau einem character
export function getCharacter(id) {
  return fs
    .readFile("./" + DB + "/" + id)
    .then((data) => JSON.parse(data.toString()));
}
// wir löschen eine datei anhand der id die ja auch gleichzeitig der dateiname ist
export function deleteCharacter(id) {
  return getCharacter(id)
    .then((character) => fs.rm(character.imglink))
    .then(() => fs.rm("./" + DB + "/" + id));
}

export function editCharacter(character) {
  return fs
    .readFile("./" + DB + "/" + character.id)
    .then((oldData) => {
      if (character.imglink) deleteImage(oldData.imglink);
      return oldData;
    })
    .then((oldItem) =>
      fs.writeFile(
        "./" + DB + "/" + oldItem.id,
        JSON.stringify(...oldItem, ...item)
      )
    );
}

function deleteImage(path) {
  fs.rm("./" + path);
}
