exports.up = function (knex) {
  return knex.schema.table("users", (table) => {
    table.string("passcode").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", (table) => {
    table.dropColumn("passcode");
  });
};
