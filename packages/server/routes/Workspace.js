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

      console.log(result);

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
    const [workspace, members, views] = await Promise.all([
      db('workspaces').where('id', req.params.id).select('workspaces.*').first(),

      db('workspace_members')
        .where('workspace_members.workspace_id', req.params.id)
        .join('users', 'workspace_members.user_id', 'users.id')
        .select('users.id', 'users.name', 'workspace_members.added'),

      db('views').where('workspace_id', req.params.id).orderBy('position').select('id', 'name', 'position', 'default'),
    ]);

    const activeViewId = req.params?.view || views.find(v => v.default)?.id;

    let columns = await db('columns')
      .orderBy('position')
      .join('views', 'columns.view_id', 'views.id')
      .where({ 'views.workspace_id': workspace.id, 'views.id': activeViewId })
      .select('columns.*');

    const tasks = await db('tasks').whereIn(
      'column_id',
      columns.map(c => c.id)
    );

    columns = columns.map(c => ({ ...c, tasks: tasks.filter(t => t.column_id == c.id) }));

    res.status(200).json({ ...workspace, members, views, columns, tasks });
  })
  // .patch(
  //   joiValidate({
  //     title: joi.string().min(3).max(255).optional(),
  //     description: joi.string().min(3).optional().allow(null, ''),
  //     completed: joi.boolean().optional(),
  //   }),
  //   async (req, res) => {
  //     const [result] = await db('task').where('id', req.params.id).update(req.body).returning('*');

  //     res.status(200).json(result);
  //   }
  // )
  // .delete(async (req, res) => {
  //   await db('task').where('id', req.params.id).del();

  //   res.status(200).json();
  // })
  .all((_req, res) => {
    res.status(405).json('Use another method');
  });

// router
//   .route('/:id/:view')
//   .get(async (req, res) => {
//     // Join the views and workspaces tables to ensure the view belongs to the workspace
//     const columns = await db('columns')
//       .join('views', 'columns.view_id', 'views.id')
//       .join('workspaces', 'views.workspace_id', 'workspaces.id')
//       .leftJoin('tasks', 'tasks.column_id', 'columns.id')
//       .where({
//         'columns.view_id': req.params.view,
//         'workspaces.id': req.params.id,
//       })
//       .select('columns.*');

//     res.status(200).json(columns);
//   })
//   // .patch(
//   //   joiValidate({
//   //     title: joi.string().min(3).max(255).optional(),
//   //     description: joi.string().min(3).optional().allow(null, ''),
//   //     completed: joi.boolean().optional(),
//   //   }),
//   //   async (req, res) => {
//   //     const [result] = await db('task').where('id', req.params.id).update(req.body).returning('*');

//   //     res.status(200).json(result);
//   //   }
//   // )
//   // .delete(async (req, res) => {
//   //   await db('task').where('id', req.params.id).del();

//   //   res.status(200).json();
//   // })
//   .all((_req, res) => {
//     res.status(405).json('Use another method');
//   });

module.exports = router;
