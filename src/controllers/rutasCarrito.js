const {Router} = require("express");
const router = Router();
const verificaToken = require("../verificaToken");
const bdCarrito = require("../models/carrito");

router.get("/api/carrito", verificaToken, async (req, res) => {
    const data = await bdCarrito.find({ id_user: req.tokenD });
    res.json(data);
});

router.post("/api/carrito/add", verificaToken, async (req, res) => {
    const user = req.tokenD;
    const identificador = req.body.Identificador;
    const nombre = req.body.Nombre;
    const descripcion = req.body.Descripcion;
    const cantidad = req.body.cantidad;
    const precio = req.body.precio;

    if (!precio || !cantidad || !identificador || !nombre || !descripcion ) {
        return res.json({ Error: "datos incompletos" });
    }

    //BUSCA SI YA EXISTE EL PRODUCTO
    const data = await bdCarrito.findOne({
        id_user: user,
        Identificador: identificador,
    });
    //SI NO EXISTE LO AGREGA
    if (!data) {
        try {
            const nuevoItemCarrito = new bdCarrito({
                id_user: user,
                Identificador: identificador,
                Nombre: nombre,
                Descripcion : descripcion,
                cantidad: cantidad,
                precio: precio
            });
            nuevoItemCarrito.save();
            return res.json({ mensaje: "producto agregado al carrito" });
        } catch (error) {
            res.json({ error: "error al agregar al carrito" });
        }
    }else{ //SI YA EXISTE ACTUZALIZA LA CANTIDAD
        data.cantidad = cantidad;
        await bdCarrito.updateOne({ id_user: user, Identificador:identificador }, {cantidad: data.cantidad});
//     await bdCarrito.updateOne({ id_user: user }, data);
        return res.json({ mensaje: "Carrito actualizado" });
    }
});

router.delete("/api/carrito", verificaToken, async (req, res) => {
    const user = req.tokenD;
    try {
        const identificador = req.body.identificador;
        if (!producto) {
            return res.json({ Error: "datos incompletos" });
        }
        await bdCarrito.deleteOne({ id_user: user, Identificador: identificador });
        res.json({ Mensjae: "Item eliminado del carrito" });
    } catch (error) {
        res.json({ error: "error al eliminar del carrito" });
    }
});

module.exports = router;


// router.post("/api/carrito/actualizar", verificaToken, async (req, res) => {
//     const user = req.tokenD;
//     const producto = req.body.producto;

//     if (!cantidad) {
//         return res.json({ Error: "No se ingreso una cantidad" });
//     }

//     let data = await bdCarrito.findOne({ id_user: user });
//     if (!data) {
//         return res.json({
//             Error: "No se encontro un carrito para este usuario",
//         });
//     }
//     data.Productos.Cantidad = cantidad;

//     await bdCarrito.updateOne({ id_user: user }, data);
//     data = await bdCarrito.findOne({ id_user: user });
//     res.status(200).json(data);
// });