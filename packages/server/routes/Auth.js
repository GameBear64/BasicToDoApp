const router = require('express').Router();

const bcrypt = require('bcryptjs');
const joi = require('joi');

const { joiValidate } = require('../middleware/validation');
const { createJWTCookie, omit } = require('../toolbox/utils');
const db = require('../data/db-config');

router
  .route('/login')
  .post(
    joiValidate({
      email: joi.string().min(10).max(255).required(),
      password: joi.string().min(8).max(255).required(),
    }),
    async (req, res) => {
      const user = await db('users').where('email', req.body.email).first();
      if (!user) return res.status(404).json('User does not exist');

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(404).json('Incorrect password');

      res.cookie('jwt', createJWTCookie(user.id));
      res.status(200).json({
        id: user.id,
        theme: user.theme,
      });
    }
  )
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/register')
  .post(
    joiValidate({
      name: joi.string().min(3).max(50).required(),
      email: joi.string().min(10).max(255).required().email(),
      password: joi.string().min(8).max(255).required(),
      confirmPassword: joi.string().valid(joi.ref('password')).required(),
    }),
    async (req, res) => {
      const userExists = await db('users').where('email', req.body.email).first();
      if (userExists) return res.status(409).json('User with this email already exists');

      const [newUser] = await db('users')
        .insert({
          ...omit(req.body, ['confirmPassword']),
          password: bcrypt.hashSync(req.body.password, 10),
        })
        .returning('*');

      res.cookie('jwt', createJWTCookie(newUser.id));
      res.status(201).json({
        id: newUser.id,
        theme: newUser.theme,
      });
    }
  )
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

module.exports = router;
