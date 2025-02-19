const serverless = require('serverless-http');
const { createApp } = require('../../manage.py');

const handler = serverless(createApp());

exports.handler = async (event, context) => {
  return await handler(event, context);
}; 