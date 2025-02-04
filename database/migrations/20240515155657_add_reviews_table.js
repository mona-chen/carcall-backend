exports.up = function (knex) {
  return knex.schema.createTable("reviews", function (table) {
    table.increments("id").primary();
    table.string("review").notNullable();
    table.float("rating").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("tour").unsigned().notNullable();
    table.integer("user").unsigned().notNullable();
    table.foreign("tour").references("tours.id").onDelete("CASCADE");
    table.foreign("user").references("users.id").onDelete("CASCADE");
    table.unique(["tour", "user"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("reviews");
};
