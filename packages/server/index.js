//====== Environment =======
require('dotenv').config({ path: '../../.env' });

//======= Database =======
const db = require('./data/db-config');
db.migrate.latest().then(([_core, migrations]) => {
  if (migrations.length > 0) {
    console.log(`Knex: running ${migrations.length} migrations:`);

    migrations.forEach(migration => {
      console.log(`- ${migration}`);
    });

    db.seed.run();
  }
});

//======= Routing =======
const express = require('express');
const app = express();
const cors = require('cors');
const { getCookies } = require('./middleware/general');

require('express-async-errors');
app.use(cors());
app.use(express.json());
app.use(getCookies);

require('./routes/_router')(app);

//======= Error Handlers =======
app.use((_req, res) => res.status(404).json('Route not found.'));

app.use((error, _req, res, _next) => {
  console.log('[SERVER ERROR]', error);
  res.status(error.status || 500).json(error.message);
});

//======= Listen on port #### =======
app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000/`);
});
