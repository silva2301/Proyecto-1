const {Schema, model} = require('mongoose');

const carritoSchema = new Schema({
    id_user: String,
    Identificador: String,
    Nombre : String,
    Descripcion : String,
    cantidad : String,
    precio: String
});

const carrito = model('carrito', carritoSchema);

module.exports = carrito;