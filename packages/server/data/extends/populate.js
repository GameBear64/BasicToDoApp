module.exports = populate = knex =>
  knex.QueryBuilder.extend(
    'populate',
    function populate(relationQuery, joinFrom, joinTo, options = {}, nestedRelations = []) {
      const childTableName = relationQuery._single.table;

      return this.then(async parentRows => {
        const parentIds = parentRows.flatMap(result => JSON.parse(result[joinFrom] || '[]'));

        // Fetch related data
        let relations = await relationQuery.whereIn(joinTo, parentIds);

        // If there are nested relations, recursively populate them
        for (const nested of nestedRelations) {
          const {
            relationQuery: nestedRelationQuery,
            joinFrom: nestedJoinFrom,
            joinTo: nestedJoinTo,
            options: nestedOptions,
          } = nested;
          relations = await Promise.all(
            relations.map(async relation => {
              relation[nestedOptions?.as || nestedRelationQuery._single.table] = await knex(
                nestedRelationQuery._single.table
              ).populate(
                nestedRelationQuery,
                nestedJoinFrom,
                nestedJoinTo,
                nestedOptions,
                nested.nestedRelations || []
              );
              return relation;
            })
          );
        }

        // Map relations to parent rows
        return parentRows.map(parentRow => {
          parentRow[options.as || childTableName] = relations.filter(relation => {
            if (relation[joinTo] === undefined) {
              throw new Error(
                `knex-with-relations: relation query is missing join column, "${joinTo}". Maybe you forgot to select it?`
              );
            }
            console.log(relation[joinTo] === parentRow[joinFrom], relation[joinTo], parentRow[joinFrom]);

            return JSON.parse(parentRow[joinFrom] || '[]').includes(relation[joinTo]);
          });

          return parentRow;
        });
      });
    }
  );
