const mongoose = require('mongoose');
const User = require('../entities/usuario');
const Util = require('./util/controller-util');
const loader = require('../infrastructure/config-loader');
const btoa = require('btoa');
const Institutions = require('../controllers/institucionesController');
const moduleToken = require('../modules/token/token-utill')

/**
 * Returns an array of Users
 */
async function Get() {
  try {
    const User = await getDB();
    let users = await User.find({});
    let result = []
    users.forEach(element => {
      let jwt = moduleToken.CreateToken(element)
      let user = {
        _id: element._id,
        name: { first: element.name.first, last: element.name.last },
        adress: {
          street: element.adress.street,
          number: element.adress.number,
          floor: element.adress.floor,
          apartment: element.adress.apartment,
        },
        phone: element.phone,
        email: element.email,
        imagePatch: element.imagePatch,
        isAdmin: element.isAdmin,
        checkIn: element.checkIn,
        checkOut: element.checkOut,
        _jwt: jwt.token,
        institutionId: element.institutionId,
      }
      result.push(user)
    });

    return result;
  } catch (err) { }
}

/**
 * Returns a User that matches the id
 * @param number {} id
 */
async function GetById(id) {
  const User = await getDB();
  let result = null;

  try {
    if (Util.IsObjectId(id)) {
      let userAux = await User.findById(id);
      let jwt = moduleToken.CreateToken(userAux)
      result = {
        _id: userAux._id,
        name: { first: userAux.name.first, last: userAux.name.last },
        adress: {
          street: userAux.adress.street,
          number: userAux.adress.number,
          floor: userAux.adress.floor,
          apartment: userAux.adress.apartment,
        },
        phone: userAux.phone,
        email: userAux.email,
        imagePatch: userAux.imagePatch,
        isAdmin: userAux.isAdmin,
        checkIn: userAux.checkIn,
        checkOut: userAux.checkOut,
        _jwt: jwt.token,
        institutionId: userAux.institutionId,
      }
      return result
    }
    else throw `>>> Error: id cannot be casted to ObjectId`;
  } catch (err) {
    console.log(err);
  }

  return result;
}

/**
 * Returns a User that matches the email
 * @param string {} email
 */
async function GetByEmail(email) {
  const User = await getDB();
  let result = null;
  try {
    let userAux = await User.findOne({ email: email });
    if (userAux != undefined && userAux !== null) {
      let jwt = moduleToken.CreateToken(userAux)
      result = {
        _id: userAux._id,
        name: { first: userAux.name.first, last: userAux.name.last },
        adress: {
          street: userAux.adress.street,
          number: userAux.adress.number,
          floor: userAux.adress.floor,
          apartment: userAux.adress.apartment,
        },
        phone: userAux.phone,
        email: userAux.email,
        imagePatch: userAux.imagePatch,
        isAdmin: userAux.isAdmin,
        checkIn: userAux.checkIn,
        checkOut: userAux.checkOut,
        _jwt: jwt.token,
        institutionId: userAux.institutionId,
      }
    }
    else throw `>>> User with email "${email}" not found`;
  } catch (err) {
    console.log(err);
  }

  return result;
}
/**
 * Returns a Users that matches with a specific IDEntidad
 * @param string {} institucionId
 */
async function GetByInstitutionId(id) {
  const User = await getDB();
  try {
    let users = await User.find({ institutionId: id });
    let result = []
    if (users.length > 0) {
      users.forEach(element => {
        let jwt = moduleToken.CreateToken(element)
        let user = {
          _id: element._id,
          name: { first: element.name.first, last: element.name.last },
          adress: {
            street: element.adress.street,
            number: element.adress.number,
            floor: element.adress.floor,
            apartment: element.adress.apartment,
          },
          phone: element.phone,
          email: element.email,
          imagePatch: element.imagePatch,
          isAdmin: element.isAdmin,
          checkIn: element.checkIn,
          checkOut: element.checkOut,
          _jwt: jwt.token,
          institutionId: element.institutionId,
        }
        result.push(user)
      });
      return result;
    } throw `>>> User with institution id "${institutionId}" not found`;
  } catch (err) {
    console.log(err);
  }

  return result;
}

/**
 * Creates a new User
 * @param User {} User object
 */
async function Create(user) {
  const User = await getDB();
  let result = null;

  let date = new Date();

  try {
    if (!(await IsEmailOnUse(user.email))) {
      if (Institutions.InstitutionExists(user.institutionId)) {
        const newUser = await new User({
          name: { first: user.name.first, last: user.name.last },
          adress: {
            street: user.adress.street,
            number: user.adress.number,
            floor: user.adress.floor,
            apartment: user.adress.apartment,
          },
          phone: user.phone,
          email: user.email,
          imagePatch: user.imagePatch,
          isAdmin: false,
          checkIn: user.checkIn,
          checkOut: user.checkOut,
          secret: btoa(btoa(date.valueOf) + Math.random() * 10000),
          institutionId: user.institutionId,
        }).save();
        result = newUser;
      } else throw `>>> Error: institution does not exist with id: ${id}`;
    } else throw `>>> Error: user email "${user.email}" already claimed`;
  } catch (err) {
    console.log(err);
  }

  return result;
}

/**
 * Updates a given User
 * @param number id
 * @param User user
 */
async function Update(id, user) {
  const User = await getDB();
  let result = null;

  try {
    if (Util.IsEqual(id, user._id))
      if (Util.IsObjectId(id))
        if (await UserExists(id))
          if (Institutions.InstitutionExists(user.institutionId))
            result = await User.findByIdAndUpdate(
              id,
              {
                name: { first: user.name.first, last: user.name.last },
                adress: {
                  street: user.adress.street,
                  number: user.adress.number,
                  floor: user.adress.floor,
                  apartment: user.adress.apartment,
                },
                phone: user.phone,
                email: user.email,
                imagePatch: user.imagePatch,
                isAdmin: user.isAdmin,
                checkIn: user.checkIn,
                checkOut: user.checkOut,
                institutionId: user.institutionId,
              },
              { useFindAndModify: false }
            );
          else throw `>>> Error: institution does not exist with id: ${id}`;
        else throw `>>> Error: user does not exist with id: ${id}`;
      else throw `>>> Error: id cannot be casted to ObjectId`;
    else throw `>>> Error: mismatching ids`;
  } catch (err) {
    console.log(err);
  }

  return result;
}
/**
 * Deletes a given User
 * @param number id
 * @param User user
 */
async function Delete(id, user) {
  const User = await getDB();
  let result = null;

  try {
    if (Util.IsEqual(id, user._id))
      if (Util.IsObjectId(id))
        if (await UserExists(id))
          result = await User.findByIdAndDelete(id, {
            useFindAndModify: false,
          });
        else throw `>>> Error: user does not exist with id: ${id}`;
      else throw `>>> Error: id cannot be casted to ObjectId`;
    else throw `>>> Error: mismatching ids`;
  } catch (err) {
    console.log(err);
  }

  return result;
}

/**
 * Checks for user existance by id
 * @param number id
 */
async function UserExists(id) {
  return (await GetById(id)) !== null ? true : false;
}

/**
 * Checks if the email is already on use
 * @param string email
 */
async function IsEmailOnUse(email) {
  return (await GetByEmail(email)) !== null ? true : false;
}

async function getDB() {
  return await global.clientConnection.useDb('usuarios').model('User');
}

module.exports = {
  Get,
  GetById,
  GetByEmail,
  GetByInstitutionId,
  Create,
  Update,
  Delete,
  UserExists,
};
