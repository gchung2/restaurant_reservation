const knex = require("../db/connection");

function list() {
  return knex("tables")
    .select("*")
    .orderBy("table_name", "asc");
}

function read(tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .first();
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(updatedTable, updatedReservation) {
  return knex.transaction(function (t) {
    return knex("tables")
      .transacting(t)
      .select("*")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable, "*")
      .then(function () {
        return knex("reservations")
          .select("*")
          .where({ reservation_id: updatedReservation.reservation_id })
          .update(updatedReservation, "*");
      })
      .then(t.commit)
      .catch(function (e) {
        t.rollback();
        throw e;
      });
  });
}

module.exports = {
  list,
  read,
  create,
  update,
};