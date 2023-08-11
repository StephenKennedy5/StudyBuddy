const uuid = require('uuid'); // Import the uuid library

exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(function () {
      return knex('users').insert([
        {
          id: uuid.v4(), // Generate a valid UUID
          name: 'John Doe',
          email: 'john@example.com',
        },
        {
          id: uuid.v4(), // Generate a valid UUID
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      ]);
    });
};
