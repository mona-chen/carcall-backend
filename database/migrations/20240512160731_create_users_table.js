// migrations/YYYYMMDDHHMMSS_create_users_table.js

exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("email").unique();
    table.string("photo");
    table
      .enum("role", ["user", "developer", "manager", "admin"])
      .defaultTo("user");
    table.string("password");
    table.string("passwordChangedAt");
    table.string("passwordResetToken");
    table.string("passwordResetExpires");
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
