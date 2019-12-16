const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

router.use(express.json());

const uri = "mongodb://localhost:27017";

let db;

MongoClient.connect(
  uri,
  {
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) throw err;

    db = client.db("comit");
    console.log("Database connected!");
  }
);

router.get("/", async (_, res) => {
  const notes = await db
    .collection("notes")
    .find()
    .toArray();

  res.json(notes);
});

router.post("/", async (req, res) => {
  const { title, note } = req.body;

  try {
    const result = await db
      .collection("notes")
      .insertOne({ title, note, date: Date() });
    res.send(result.insertedId);
  } catch (e) {
    console.error(e);
    res.send("error");
  }
});

router.delete("/", async (req, res) => {
  let { id } = req.headers;

  try {
    await db.collection("notes").deleteOne({ _id: new ObjectId(id) });
    res.json({ deleted: true });
  } catch (e) {
    console.error(e);
    res.json({ deleted: false });
  }
});

router.patch("/", async (req, res) => {
  const { title, note } = req.body;
  const { id } = req.headers;

  const result = await db
    .collection("notes")
    .updateOne({ _id: new ObjectId(id) }, { $set: { title, note } });

  res.send(id);
});

module.exports = router;
