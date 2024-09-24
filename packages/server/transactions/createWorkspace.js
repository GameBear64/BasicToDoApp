const { omit } = require('../toolbox/utils');

exports.createWorkspaceWithUser = async (db, columns) => {
  return await db.transaction(async trx => {
    const [workspace] = await trx('workspaces')
      .insert(omit(columns, ['views']))
      .returning('id');

    // Add the user as the first member of the workspace
    await trx('workspace_members').insert({
      workspace_id: workspace.id,
      user_id: columns.owner,
    });

    const createdViews = await trx('views')
      .insert(
        columns.views.map((v, i) => ({ workspace_id: workspace.id, name: v.name, position: i, default: v.default }))
      )
      .returning(['id', 'name']);

    await trx('columns').insert(
      [].concat(
        ...createdViews.map(v =>
          columns.views.find(cv => cv.name == v.name).columns.map((c, i) => ({ view_id: v.id, name: c, position: i }))
        )
      )
    );

    return workspace;
  });
};
