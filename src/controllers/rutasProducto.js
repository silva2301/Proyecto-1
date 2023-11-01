const Router = require("express");
const router = Router();
const bdProducto = require("../models/producto");
const verificaToken = require("../verificaToken");
const validadores = require("../validadores.js");

//Catálogo de Productos
router.get("/api/productos", async (req, res) => {
    const data = await bdProducto.find();
    res.status(200).json(data);
});

router.get("/api/Producto/:ID", async (req, res) => {
    const data = await bdProducto.findOne({ Identificador: req.params.ID });
    if (!data) {
        return res.status(404).json({ Error: "Producto no encontrado" });
    }
    res.json(data);
});

router.post("/api/Producto/:ID", verificaToken, async (req, res) => {
    const objetoProducto = req.body;
    if (!validadores.validaCamposVacios2(objetoProducto)) {
        return res.status(400).json({Error: "No se admiten campos vacios"});
    }
    await bdProducto.updateOne({Identificador: req.params.ID}, objetoProducto);
    const data = await bdProducto.findOne({Identificador : req.params.ID})
    res.status(200).json(data);
});

router.delete('/api/Producto/:ID', verificaToken, async(req, res) => {
    const data = await bdProducto.findOne({ Identificador: req.params.ID });
    if (!data) {
        return res.status(404).json({ Error: "Producto no encontrado" });
    }
    bdProducto.deleteOne({Identificador : req.params.ID})
    res.status(200).json({Producto: data.Nombre + " eliminado correctamente"})
});

module.exports = router;
