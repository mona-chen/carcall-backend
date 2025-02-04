// migrations/20240516120000_create_error_stack_table.js
exports.up = function (knex) {
  return knex.schema.createTable("error_stack", function (table) {
    table.increments("id").primary();
    table.string("status").notNullable();
    table.jsonb("error").notNullable(); // Assuming error details are stored as JSON
    table.string("message").notNullable();
    table.text("stack");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("error_stack");
};
