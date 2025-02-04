exports.up = function (knex) {
  return knex.schema.table("tours", function (table) {
    table.string("subtitle");
    table.jsonb("highlights");
    table.jsonb("what_included");
    table.jsonb("what_not_included");
  });
};

exports.down = function (knex) {
  return knex.schema.table("tours", function (table) {
    table.dropColumn("subtitle");
    table.dropColumn("highlights");
    table.dropColumn("what_included");
    table.dropColumn("what_not_included");
  });
};
