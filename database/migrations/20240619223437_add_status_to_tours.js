exports.up = function (knex) {
  return knex.schema.table("tours", function (table) {
    table
      .enum("status", ["draft", "unpublished", "published"])
      .default("draft");
  });
};

exports.down = function (knex) {
  return knex.schema.table("tours", function (table) {
    table.dropColumn("status");
  });
};
