exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string("google_id").unique();
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("google_id");
  });
};
