const express = require ('express');
const pool = require ('./db');
const PORT = 3000;

const app = express ();

app.use (express.json ());

app.post ('/config', async (req, res) => {
  try {
    const {models, GET} = req.body;
    createModels (models);
    createGetters (GET);
    res.send ('Config created');
  } catch (error) {
    res.json ({
      error: error.message,
    });
  }
});

app.listen (PORT, async () => {
  console.log (`listening in port ${PORT}`);
});

const createGetters = GET => {
  Object.keys (GET).forEach (endpoint => {
    app.get (endpoint, async (req, res) => {
      const values = GET[endpoint].split ('-');
      let createEndpointQuery = `SELECT * FROM ${values[0]} `;
      if (values.length > 1) {
        values.forEach ((v, i) => {
          if (i > 0) {
            if (i == 1) {
              createEndpointQuery += `WHERE ${v} = ${req.query[v]} `;
            } else {
              createEndpointQuery += `and ${v} = ${req.query[v]} `;
            }
          }
        });
      }
      createEndpointQuery += ';';
      console.log (createEndpointQuery);
      const get = await pool.query (createEndpointQuery, []);
      res.json (get.rows);
    });
  });
};

const createModels = models => {
  Object.keys (models).forEach (modelName => {
    let createTableQuery = `CREATE TABLE ${modelName} (
        ${Object.keys (models[modelName]).map (attrName => {
          const processed = models[modelName][attrName].split ('-');
          return `${attrName} ${getType (processed[0])} ${processed[1] == 'PK' ? 'PRIMARY KEY' : ''}`;
        })}
    )`;
    createTableQuery += ';';
    console.log (createTableQuery);
    pool.query (createTableQuery, []);
  });
};

const getType = type => {
  switch (type) {
    case 'int':
      return 'INTEGER';
    case 'boolean':
      return 'BOOLEAN';
    default:
      return 'TEXT';
  }
};
