 /**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('plans', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description').nullable();
        table.boolean('unlimited_qr').defaultTo(false);
        table.boolean('call_tracking').defaultTo(false);
        table.decimal('price', 8, 2);
        table.timestamps(true, true);
      })
      .table("users", (table) => {
        table.jsonb('emergency_contacts');
        table.jsonb('address');
        table.integer('plan_id').references('id').inTable('plans');
        table.boolean('is_vendor').defaultTo(false);
    })
      .createTable('qr_codes', (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users').notNullable();
        table.jsonb('qr_data').notNullable();
        table.integer('scans_count').defaultTo(0);
        table.jsonb('scan_locations').nullable();
        table.jsonb('style_config'); // {color: '#000', shape: 'square', ...}
        table.timestamps(true, true);
      })
      .createTable('vendors', (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users').notNullable();
        table.string('store_name').notNullable();
        table.string('store_description');
        table.timestamps(true, true);
      })
      .createTable('products', (table) => {
        table.increments('id').primary();
        table.integer('vendor_id').references('id').inTable('vendors').notNullable();
        table.string('name').notNullable();
        table.text('description');
        table.jsonb('media').nullable();
        table.decimal('price', 8, 2).notNullable();
        table.integer('stock').defaultTo(0);
        table.timestamps(true, true);
      })
      .createTable('orders', (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users').notNullable();
        table.integer('vendor_id').references('id').inTable('vendors').notNullable();
        table.string('status').defaultTo('pending');
        table.decimal('total', 10, 2).notNullable();
        table.timestamps(true, true);
      })
      .createTable("sip_users", (table) => {
        table.increments("id").primary();
        table.string("sip_username").unique().notNullable();
        table.string("sip_password").notNullable();
        table.string("contact_number").nullable();
        table.string("status").defaultTo("active");
        table.timestamps(true, true);
      })
      .createTable('call_logs', (table) => {
        table.increments('id').primary();
        table.integer('receiver').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.integer('caller').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.enum('call_type', ['incoming', 'outgoing', 'missed']).notNullable();
        table.string('status').notNullable(); // answered/missed
        table.string('jitsi_room');
        table.timestamp('call_start').defaultTo(knex.fn.now());
        table.timestamp('call_end').nullable();
        table.string('call_recording_url').nullable();
        table.timestamps(true, true);
      });
      
    ;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('call_logs')
    .dropTableIfExists('orders')
    .dropTableIfExists('products')
    .dropTableIfExists('vendors')
    .dropTableIfExists('sip_users')
    .dropTableIfExists('qr_codes')
    .dropTableIfExists('plans');

};