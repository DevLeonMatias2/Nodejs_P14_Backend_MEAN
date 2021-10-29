const {validarJWT} = require("../middlewares/validar-jwt");
const {validarCampos} = require("../middlewares/validar-campos");
const {check} = require("express-validator");
const { Router} = require('express');
const {crearUsuario,loginUsuario,revalidarToken} = require("../controllers/auth");


const router = Router();

    //Crear un nuevo usuario
router.post('/new',[
    check('name', ' el nombre del usuario').not().isEmpty(),
    check('email', 'El email del usuario es obligatorio').isEmail(),
    check('password', 'El password no coincide').isLength({min:6}),
    validarCampos
],crearUsuario)

//Login de usuario
router.post('/',[
    check('email','El email es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos,
],loginUsuario)

//Validar y revalidar token
router.get('/renew', validarJWT,revalidarToken)


module.exports = router;
