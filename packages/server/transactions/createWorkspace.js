const { omit } = require('../toolbox/utils');

exports.createWorkspaceWithUser = async (db, columns) => {
  return await db.transaction(async trx => {
    const [workspace] = await trx('workspaces')
      .insert(omit(columns, ['views']))
      .returning('id');

    // Default labels
    const a = await trx('task_types').insert([
      { workspace_id: workspace.id, title: 'Bug', color: 'red', icon: 'bug_report' },
      { workspace_id: workspace.id, title: 'Feature', color: 'blue', icon: 'trending_up' },
      { workspace_id: workspace.id, title: 'Chore', color: 'yellow', icon: 'construction' },
      { workspace_id: workspace.id, title: 'Story', color: 'violet', icon: 'book' },
    ]);

    // Default fields
    await trx('custom_fields').insert([
      { workspace_id: workspace.id, title: 'PR Link' },
      { workspace_id: workspace.id, title: 'Story points' },
      { workspace_id: workspace.id, title: 'Hours worked' },
    ]);

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
