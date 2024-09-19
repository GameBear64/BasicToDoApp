const router = require('express').Router();

const bcrypt = require('bcryptjs');
const joi = require('joi');

const { joiValidate } = require('../middleware/validation');
const db = require('../data/db-config');

router
  .route('/')
  .get(async (req, res) => {
    const user = await db('users').where('id', req.authUser.id).select('id', 'theme').first();

    res.status(200).json(user);
  })
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/password')
  .patch(
    joiValidate({
      password: joi.string().min(8).max(255).required(),
      newPassword: joi.string().min(8).max(255).required(),
      confirmPassword: joi.string().valid(joi.ref('newPassword')).required(),
    }),
    async (req, res) => {
      const user = await db('users').where('id', req.authUser.id).first();
      if (!user) return res.status(404).json('User does not exit');

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(404).json('Incorrect password');

      await db('users').update('password', bcrypt.hashSync(req.body.newPassword, 10));

      res.status(200).json('Password updated');
    }
  )
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

module.exports = router;
