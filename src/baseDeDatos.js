const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://lk3v1nn:dE658bz9Pr88GPgS@cluster0.i5qgmef.mongodb.net/PryectoUMG"
  )
  .catch((err) => {
    console.log(err);
  });

const connection = mongoose.connection;

//Evento de cuando se conecta a la BD
connection.on("open", () => {
  console.log("Conectado a la Base de datos");
});

connection.on("err", (err) => {
  console.log("Error DB: ", err);
});

