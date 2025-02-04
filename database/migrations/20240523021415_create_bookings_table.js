/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("bookings", (table) => {
    table.increments("id").primary();
    table.integer("tour_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.boolean("paid").defaultTo(false);
    table.string("payment_method").nullable();
    table.boolean("cancelled").defaultTo(false);
    table.timestamp("cancelled_at").nullable();
    table.decimal("refund_amount", 10, 2).defaultTo(0);
    table.timestamp("refund_processed_at").nullable();

    table.foreign("tour_id").references("tours.id").onDelete("CASCADE");
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("bookings");
};
