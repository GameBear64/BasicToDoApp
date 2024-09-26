const router = require('express').Router();

const joi = require('joi');

const { icons, colors } = require('../toolbox/consts');
const { joiValidate } = require('../middleware/validation');
const db = require('../data/db-config');

const { createWorkspaceWithUser } = require('../transactions/createWorkspace');

router
  .route('/all')
  .get(async (req, res) => {
    const result = await db('workspaces')
      .join('workspace_members', 'workspaces.id', 'workspace_members.workspace_id')
      .where('workspace_members.user_id', req.authUser.id)
      .join('views', 'views.workspace_id', 'workspaces.id')
      .where('views.default', true)
      .select('workspaces.*', 'views.id as default_view');

    res.status(200).json(result);
  })
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/')
  .post(
    joiValidate({
      name: joi.string().min(3).max(255).required(),
      icon: joi
        .string()
        .valid(...icons)
        .required(),
      color: joi
        .string()
        .valid(...colors)
        .required(),
      views: joi
        .array()
        .items(
          joi.object({
            name: joi.string().required(),
            default: joi.bool().required(),
            columns: joi.array().items(joi.string().required()).min(1).required(),
          })
        )
        .min(1)
        .required(),
    }),
    async (req, res) => {
      const result = await createWorkspaceWithUser(db, { ...req.body, owner: req.authUser.id });

      res.status(201).json(result);
    }
  )
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

router
  .route('/:id/:view?')
  .get(async (req, res) => {
    // run in parallel for speed
    let [workspace, members, views, columns] = await Promise.all([
      db('workspaces').where('id', req.params.id).select('workspaces.*').first(),

      db('workspace_members')
        .where('workspace_members.workspace_id', req.params.id)
        .join('users', 'workspace_members.user_id', 'users.id')
        .select('users.id', 'users.name', 'workspace_members.added'),

      db('views').where('workspace_id', req.params.id).orderBy('position').select('id', 'name', 'position', 'default'),

      db('columns')
        .orderBy('position')
        .join('views', 'columns.view_id', 'views.id')
        .where({ 'views.workspace_id': req.params.id })
        .select('columns.*'),
    ]);

    views = views.map(v => ({ ...v, columns: columns.filter(c => c.view_id == v.id) }));

    const activeViewId = req.params?.view || views.find(v => v.default)?.id;

    const tasks = await db('tasks')
      .whereIn(
        'column_id',
        columns.map(c => c.id)
      )
      .orderBy('position');

    columns = columns
      .filter(c => c.view_id == activeViewId)
      .map(c => ({ ...c, tasks: tasks.filter(t => t.column_id == c.id) }));

    res.status(200).json({ ...workspace, members, views, columns });
  })
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

module.exports = router;
