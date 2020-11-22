const mongoose = require('mongoose');
const Util = require('./util/controller-util');
const jwt = require('jsonwebtoken');

//Funcion para generar Token

async function CreateToken(qr) {

    let result = null;
    try {
        if (qr!==null){

            const token = jwt.sign(qr._id,qr.secret);
            result = {
                token: token,
            };
        }
        else throw `>>> Secret no provided`;
    }catch (error) {
        console.log(error);
    }
    return result;
}

async function VerifyToken (token,secret) {
let result = false
    jwt.verify(token, secret, function (error) {
        if (!error) 
            result=true;
    });

    return result;
}

module.exports = {
    CreateToken,
    VerifyToken,
};