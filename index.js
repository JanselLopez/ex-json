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

const createGetters = GET => {};

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
