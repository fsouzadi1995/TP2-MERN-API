const mongoose = require('mongoose');
const User = require('../entities/usuario');
const Util = require('./util/controller-util');
const btoa = require('btoa');
const Institutions = require('../controllers/institucionesController');
const tokenUtil = require('./util/token-util');

/**
 * Returns an array of Users
 */
async function Get() {
  const User = await getDB();
  let result = null;

  try {
    let users = await User.find({});

    if (users !== null && users.length > 0) {
      result = [];

      users.forEach((u) => {
        let user = tokenUtil.RemoveSensitive(u.toObject());
        result.push(user);
      });
    }
  } catch (err) {
    console.log(err);
  }

  return result;
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
      let user = await User.findById(id);

      if (user === null) throw `>>> User with id "${id}" not found`;

      result = tokenUtil.RemoveSensitive(user.toObject());
    } else throw `>>> Error: id cannot be casted to ObjectId`;
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
    let user = await User.findOne({ email: email });

    if (user !== null) result = tokenUtil.RemoveSensitive(user.toObject());
    else throw `>>> User with email "${email}" not found`;
  } catch (err) {
    console.log(err);
  }

  return result;
}
/**
 * Returns a Users that matches a specific Institution
 * @param string {} institucionId
 */
async function GetByInstitutionId(id) {
  const User = await getDB();
  let result = null;

  try {
    if (Institutions.InstitutionExists(id)) {
      let users = await User.find({ institutionId: id });

      if (users !== null && users.length > 0) {
        result = [];

        users.forEach((u) => {
          let user = tokenUtil.RemoveSensitive(u);
          result.push(user);
        });
      }
    } else throw `>>> User with institution id "${id}" not found`;
  } catch (err) {
    console.log(err);
  }

  return result;
}

/**
 * Returns a user secret based on the given id
 * @param id string
 */
async function GetSecretById(id) {
  const User = await getDB();
  let result = null;

  try {
    if (Util.IsObjectId(id)) {
      result = await User.findById(id).secret;
    } else throw `>>> Error: id cannot be casted to ObjectId`;
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
      if (await Institutions.InstitutionExists(user.institutionId)) {
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

        if (newUser === null) throw `>>> An error has ocurred`;

        result = tokenUtil.RemoveSensitive(newUser.toObject());
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
          if (await Institutions.InstitutionExists(user.institutionId)) {
            const newUser = await User.findByIdAndUpdate(
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
            if (newUser === null) throw `>>> An error has ocurred`;

            result = await tokenUtil.RemoveSensitive(newUser.toObject());
          } else throw `>>> Error: institution does not exist with id: ${id}`;
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
  GetSecretById,
  Create,
  Update,
  Delete,
  UserExists,
};
