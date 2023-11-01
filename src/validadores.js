const bdUsuarios = require("./models/usuario");

async function validaNitExistente(NIT) {
    const data = await bdUsuarios.findOne({ NIT });
    if (!data) {
        return false;
    }
    return true;
}

async function validaCorreoExistente(CorreoElectronico) {
    const data = await bdUsuarios.findOne({ CorreoElectronico });
    if (!data) {
        return false;
    }
    return true;
}

async function validaCorreoExistente(CorreoElectronico) {
    const usuarioExiste = await bdUsuarios.findOne({
        CorreoElectronico: CorreoElectronico,
    });
    if (!usuarioExiste) {
        return false;
    }
    return true;
}

function validarCorreo(correo) {
    let regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(correo);
}

function validarClaveSegura(clave) {
    let tieneLongitudValida = clave.length >= 8;
    let tieneMayusculas = /[A-Z]/.test(clave);
    let tieneMinusculas = /[a-z]/.test(clave);
    let tieneNumeros = /\d/.test(clave);
    let tieneCaracteresEspeciales = /[\W_]/.test(clave);

    return (
        tieneLongitudValida &&
        tieneMayusculas &&
        tieneMinusculas &&
        tieneNumeros &&
        tieneCaracteresEspeciales
    );
}

function validarClaveConClave(clave, clave2) {
    if (clave === clave2) {
        return true;
    }
    return false;
}

function validaCamposVacios2(objeto) {
    for (let atributo in objeto) {
        if (
            objeto[atributo] == null ||
            objeto[atributo] == undefined ||
            objeto[atributo] == ""
        ) {
            return false;
        }
    }
    return true;
}

async function validarNitDuplicado(nit, id) {
    const encontrado = await bdUsuarios.findOne({ NIT: nit, _id: { $ne: id } });
    if (!encontrado) {
        return false;
    }
    return true;
}

async function validarCorreoDuplicado (correo, id){
    const encontrado = await bdUsuarios.findOne({CorreoElectronico : correo, _id : {$ne : id}});
    if (!encontrado){
        return false
    }
    return true
}

const validadores = {
    validarCorreo,
    validarClaveSegura,
    validarClaveConClave,
    validaCamposVacios2,
    validaNitExistente,
    validaCorreoExistente,
    validarNitDuplicado,
    validarCorreoDuplicado
};
module.exports = validadores;
