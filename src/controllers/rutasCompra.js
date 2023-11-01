const Router = require("express");
const router = Router();
const bdCarrito = require("../models/carrito");
const bdProducto = require("../models/producto");
const bdCompra = require("../models/compra");

const verificaToken = require("../verificaToken");

router.post("/api/compra", verificaToken, async (req, res) => {
    const dataCarrito = await bdCarrito.findOne({ id_user: req.tokenD });
    if(!dataCarrito){return res.status(400).json({Error : "El usuario no tiene articulos en el carrito"})}
    
    const cantidad = dataCarrito?.Productos.Cantidad;
    const idProducto = dataCarrito?.Productos.Identificador;
    const dataProducto = await bdProducto.findOne({ Identificador: idProducto });

    dataProducto.Disponibilidad = dataProducto.Disponibilidad - cantidad;
    await bdProducto.updateOne({ Identificador: idProducto }, dataProducto);

    const nuevaCompra = new bdCompra({ id_user: req.tokenD, Productos: dataCarrito?.Productos });
    nuevaCompra.save();

    res.json({ "Mensaje": "Inventario actualizado", "Mensaje2": "Bitácora creada" });
});

module.exports = router;
