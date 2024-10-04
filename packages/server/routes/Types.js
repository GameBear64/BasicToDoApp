const router = require('express').Router();

const joi = require('joi');

const { joiValidate } = require('../middleware/validation');
const db = require('../data/db-config');

router
  .route('/')
  .get(
    joiValidate({
      workspace_id: joi.string().uuid().required(),
    }),
    async (req, res) => {
      const result = await db('task_types').where('workspace_id', req.body.workspace_id);

      res.status(200).json(result);
    }
  )
  .post(
    joiValidate({
      title: joi.string().min(3).max(255).required(),
      color: joi.string().required(),
      icon: joi.string().required(),
      workspace_id: joi.string().uuid().required(),
    }),
    async (req, res) => {
      const [result] = await db('task_types').insert(req.body).returning('*');

      res.status(201).json(result);
    }
  )
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/:id')
  .patch(
    joiValidate({
      title: joi.string().min(3).max(255).required(),
      color: joi.string().required(),
      icon: joi.string().required(),
      workspace_id: joi.string().uuid().required(),
    }),
    async (req, res) => {
      const [result] = await db('task_types')
        .where('workspace_id', req.body.workspace_id)
        .update(req.body)
        .returning('*');

      res.status(200).json(result);
    }
  )
  .delete(async (req, res) => {
    await db('task_types').where('workspace_id', req.body.workspace_id).del();

    res.status(200).json();
  })
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

module.exports = router;
