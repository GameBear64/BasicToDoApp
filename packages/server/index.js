const express = require('express');
const app = express();
const cors = require('cors');

require('express-async-errors');
app.use(cors());
app.use(express.json());

require('./routes/router')(app);

//========= Error Handlers ==========
app.use((_req, res) => res.status(404).json('Route not found.'));

app.use((error, _req, res, _next) => {
  console.log('[SERVER ERROR]', error);
  res.status(error.status || 500).json(error.message);
});

//===== Listen on port #### =====
app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000/`);
});
