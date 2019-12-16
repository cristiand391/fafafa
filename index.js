const express = require("express");
const path = require("path");
const notes = require("./routes/api/notes");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/notes", notes);

app.post("/fafa", (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// https://www.maketecheasier.com/use-google-roboto-font-everywhere/
