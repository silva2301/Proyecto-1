const { Router } = require("express");
const bdUsuarios = require("../models/usuario");
const validadores = require("../validadores");
const jwt = require("jsonwebtoken");
const verificaToken = require("../verificaToken");

const router = Router();

//RUTA DE REGISTRO DE USUARIOS
router.post("/api/registro/:DPI", async (req, res) => {
    //GUARDO LOS DATOS EN VARIABLES
    const {
        Nombres,
        Apellidos,
        FechaNacimiento,
        Clave,
        ValidacionClave,
        DireccionEntrega,
        NIT,
        NumeroTelefonico,
        CorreoElectronico,
    } = req.body;

    //VALIDADORES DE DATOS
    if (!validadores.validarCorreo(CorreoElectronico)) {
        return res.status(400).json({ Error: "Formato del correo no valido" });
    }
    if (await validadores.validaNitExistente(NIT)) {
        return res.status(400).json({ Error: "El NIT ingresado ya existe" });
    }
    if (await validadores.validaCorreoExistente(CorreoElectronico)) {
        return res
            .status(400)
            .json({ Error: "El Correo electronico ingresado ya existe" });
    }
    if (!validadores.validarClaveSegura(Clave)) {
        return res.status(400).json({
            Error: "La clave debe contener 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales",
        });
    }
    if (!validadores.validarClaveConClave(Clave, ValidacionClave)) {
        return res.status(400).json({ Error: "Las claves no coinciden" });
    }
    if (!validadores.validaCamposVacios2(req.body)) {
        return res.status(400).json({ Error: "No se permiten campos vacios" });
    }

    //Módulo de Registro de Usuarios
    const nuevoUsuario = new bdUsuarios({
        Nombres: Nombres,
        Apellidos: Apellidos,
        FechaNacimiento: FechaNacimiento,
        Clave: Clave,
        ValidacionClave: ValidacionClave,
        DireccionEntrega: DireccionEntrega,
        NIT: NIT,
        NumeroTelefonico: NumeroTelefonico,
        CorreoElectronico: CorreoElectronico,
    });
    nuevoUsuario.save();
    res.json({ mensaje: "Usuario creado exitosamente" });
});

//Módulo de Login:
router.post("/api/login", async (req, res) => {
    const { CorreoElectronico, Clave } = req.body;
    try {
        const data = await bdUsuarios.findOne({ CorreoElectronico, Clave });
        if (!data) {
            return res
                .status(401)
                .json({ Error: "Las credenciales no son validas" });
        }
        const token = jwt.sign({ id: data._id }, "textosupersecreto", {
            expiresIn: 60 * 60 * 24 * 30,
        });
        res.cookie("token", token).json({ mensaje: 'sesion iniciada' });
    } catch (error) {
        res.status(500).json({ Error: "Error del servidor" });
    }
});

//Módulo de Gestión de Perfil:
router.get("/api/perfil/:DPI", verificaToken, async (req, res) => {
    const data = await bdUsuarios.findOne({ _id: req.tokenD });
    res.json(data);
});

router.post("/api/perfil/:DPI", verificaToken, async (req, res) => {
    const objetoUsuario = req.body;

    if (!validadores.validarCorreo(objetoUsuario.CorreoElectronico)) {
        return res.status(400).json({ Error: "Formato del correo no valido" });
    }
    if (!validadores.validaCamposVacios2(objetoUsuario)) {
        return res.status(400).json({ Error: "No se permiten campos vacios" });
    }
    if (await validadores.validarNitDuplicado(objetoUsuario.NIT, req.tokenD)) {
        return res
            .status(400)
            .json({ Error: "El NIT ya existe para otro usuario" });
    }
    if (
        await validadores.validarCorreoDuplicado(
            objetoUsuario.CorreoElectronico,
            req.tokenD
        )
    ) {
        return res
            .status(400)
            .json({
                Error: "El Correo electronico ya existe para otro usuario",
            });
    }

    await bdUsuarios.updateOne({ _id: req.tokenD }, objetoUsuario);
    // const data = await bdUsuarios.findOne({ _id: req.tokenD });
    res.status(200).json({ Mensaje: "Datos actualizados con exito" });
});

router.delete("/api/perfil/:DPI", verificaToken, async (req, res) => {
    const { Clave, CorreoElectronico } = req.body;
    const credencialesValidas = await bdUsuarios.findOne({
        Clave,
        CorreoElectronico,
    });
    if (!credencialesValidas) {
        return res
            .status(400)
            .json({
                Error: "Ingrese la clave y correo correcta para eliminar el usuario",
            });
    }
    await bdUsuarios.deleteOne({ Clave, CorreoElectronico });
    res.status(200).json({
        mensajes: "Usuario: " + CorreoElectronico + " eliminado correctamente",
    });
});

module.exports = router;
