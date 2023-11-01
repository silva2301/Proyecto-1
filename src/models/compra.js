const {Schema, model} = require('mongoose');

const compraSchema = new Schema({
    id_user : String,
    Productos : Object
});

const compra = model('compras', compraSchema)

module.exports = compra;