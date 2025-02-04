exports.up = function (knex) {
  return knex.schema.createTable("tours", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.integer("duration").notNullable();
    table.integer("maxGroupSize").notNullable();
    table.string("difficulty").notNullable();
    table.float("ratingsAverage").defaultTo(4.5);
    table.integer("ratingsQuantity").defaultTo(0);
    table.float("price").notNullable();
    table.float("priceDiscount");
    table.string("summary").notNullable();
    table.text("description");
    table.string("imageCover").notNullable();
    table.json("images");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.json("startDates");
    table.boolean("secretTour").defaultTo(false);
    table.json("startLocation");
    table.json("locations");
    table.json("guides");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tours");
};
