const router = require('express').Router();

const joi = require('joi');

const { joiValidate } = require('../middleware/validation');
const db = require('../data/db-config');

router
  .route('/')
  .post(
    joiValidate({
      title: joi.string().min(3).max(255).required(),
      description: joi.string().min(3).optional().allow(null, ''),
      column_id: joi.string().uuid().required(),
    }),
    async (req, res) => {
      const { count } = await db('tasks').where('column_id', req.body.column_id).count('id as count').first();

      const [result] = await db('tasks')
        .insert({ ...req.body, position: count + 1, author: req.authUser.id })
        .returning('*');

      res.status(201).json(result);
    }
  )
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/:id')
  .get(async (req, res) => {
    const result = await db('tasks').where('id', req.params.id);

    res.status(200).json(result);
  })
  .patch(
    joiValidate({
      title: joi.string().min(3).max(255).optional(),
      description: joi.string().min(3).optional().allow(null, ''),
      column_id: joi.string().uuid().optional(),
    }),
    async (req, res) => {
      const [result] = await db('tasks').where('id', req.params.id).update(req.body).returning('*');

      res.status(200).json(result);
    }
  )
  .delete(async (req, res) => {
    await db('tasks').where('id', req.params.id).del();

    res.status(200).json();
  })
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/:id/move')
  .patch(
    joiValidate({
      column_id: joi.string().uuid().required(),
      position: joi.number().required(),
    }),
    async (req, res) => {
      const [result] = await db('tasks').where('tasks.id', req.params.id).update(req.body).returning('*');

      res.status(200).json(result);
    }
  )
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

module.exports = router;
