const { Schema, model } = require("mongoose");

const usuarioSchema = new Schema ({
    'Nombres' : String,
    'Apellidos' : String,
    'FechaNacimiento' : String,
    'Clave': String,
    'ValidacionClave': String,
    'DireccionEntrega': String,
    'NIT': Number,
    'NumeroTelefonico': Number,
    'CorreoElectronico': String
});

const usuario = model('usuarios', usuarioSchema);

module.exports = usuario;