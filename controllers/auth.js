const {validationResult} = require("express-validator");
const {response} = require("express");
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require("../helpers/jwt");


const crearUsuario = async (req, res = response) => {

    const {email, name, password} = req.body

    try {
        // VERIFICAR EL EMAIL
        const usuario = await Usuario.findOne({email});

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            })
        }

        // CREAR EL USUARIO CON EL MODELO
        const dbUser = new Usuario(req.body);


        // HASHEAR LA CONTRASEÑA
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);


        // GENERAR EL JWT
        const token = await generarJWT(dbUser.id, name);


        // crear usuario de DB
        await dbUser.save();

        // GENERAR RESPUESTA EXITOSA
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        })


    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }


    return res.json({
        ok: true,
        msg: 'Crear usuario /new '
    })
}
const loginUsuario = async (req, res = response) => {

    const {email, password} = req.body

    try {

        const dbUser = await Usuario.findOne({email})

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            })
        }

        //Generar el jwt

        const token = await generarJWT(dbUser.id, dbUser.name);

        // Respuesta del servicio
        return res.json({
            ok:true,
            uid:dbUser.id,
            name:dbUser.name,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const revalidarToken = async (req, res = response) => {


    const {uid, name} = req;
    //Generar el JWT
    const token = await generarJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        name,
        token

    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
