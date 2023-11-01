const {Schema, model} = require ('mongoose');

const productoSchema = new Schema ({
    Identificador : String,
    Nombre : String, 
    Marca : String,
    Disponibilidad : Number,
    Descuento : Number,
    PrecioDescuento : Number,
    Imagen : String,
    Descripcion : String,
    Categorias : Array
});

const producto = model('productos', productoSchema);

module.exports = producto;