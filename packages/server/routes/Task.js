const router = require('express').Router();

const joi = require('joi');

const { joiValidate } = require('../toolkit/utils');
const db = require('../data/db-config');

router
  .route('/all')
  .get(async (_req, res) => {
    const result = await db('todo');

    res.status(200).json(result);
  })
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/')
  .post(
    joiValidate({
      title: joi.string().min(3).max(255).required(),
      description: joi.string().min(3).optional().allow(null, ''),
    }),
    async (req, res) => {
      const result = await db('todo')
        .returning('*')
        .insert(req.body)
        .then(data => data[0]);

      res.status(201).json(result);
    }
  )
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/:id')
  .get(async (req, res) => {
    const result = await db('todo').where('id', Number(req.params.id));

    res.status(200).json(result);
  })
  .patch(
    joiValidate({
      title: joi.string().min(3).max(255).optional(),
      description: joi.string().min(3).optional().allow(null, ''),
      completed: joi.boolean().optional(),
    }),
    async (req, res) => {
      const result = await db('todo')
        .where('id', Number(req.params.id))
        .update({ ...req.body, updated_at: db.fn.now() })
        .returning('*')
        .then(data => data[0]);

      res.status(200).json(result);
    }
  )
  .delete(async (req, res) => {
    await db('todo').where('id', Number(req.params.id)).del();

    res.status(200).json();
  })
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

module.exports = router;
