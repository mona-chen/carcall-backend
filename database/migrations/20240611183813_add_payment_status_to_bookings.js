exports.up = function (knex) {
  return knex.schema.table("bookings", function (table) {
    table
      .enu("payment_status", ["pending", "paid", "failed"])
      .defaultTo("pending");
  });
};

exports.down = function (knex) {
  return knex.schema.table("bookings", function (table) {
    table.dropColumn("payment_status");
  });
};
