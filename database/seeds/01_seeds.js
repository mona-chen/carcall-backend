// seeds/01_users.js

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          name: "John Doe",
          email: "john@example.com",
          photo: "default.jpg",
          role: "admin",
          password: "hashedpassword", // Remember to hash the passwords
          // Add other fields as needed
        },
        // Add more seed entries as needed
      ]);
    });
};
