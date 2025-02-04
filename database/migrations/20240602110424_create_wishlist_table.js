exports.up = function (knex) {
  return knex.schema.createTable("wishlist", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("tour_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tours")
      .onDelete("CASCADE");
    table.timestamps(true, true);

    table.unique(["user_id", "tour_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("wishlist");
};
