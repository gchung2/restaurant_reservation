const reservationsService = require("../reservations/reservations.service");
const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasReservationId = hasProperties("reservation_id");

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

function validateCapacity(req, res, next) {
  const capacity = req.body.data.capacity;
  if (typeof capacity == "number") {
    return next();
  }
  next({ status: 400, message: "capacity should be Number" });
}

function validateCapacityValue(req, res, next) {
  const capacity = req.body.data.capacity;
  if (capacity > 0) {
    return next();
  }
  next({ status: 400, message: "capacity should be non zero" });
}

function validateName(req, res, next) {
  const tableName = req.body.data.table_name;
  if (tableName.length > 1) {
    return next();
  }
  next({
    status: 400,
    message: "table_name should have more than 1 characters",
  });
}

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

function tableExists(req, res, next) {
  const tableId = req.params.table_id;
  tablesService
    .read(tableId)
    .then((table) => {
      if (table) {
        res.locals.table = table;
        return next();
      }
      next({ status: 404, message: `Table ${tableId} cannot be found.` });
    })
    .catch(next);
}

function read(req, res) {
  const { table: data } = res.locals;
  res.json({ data });
}

function create(req, res, next) {
  tablesService
    .create(req.body.data)
    .then((data) => {
      res.status(201).json({ data });
    })
    .catch(next);
}

async function update(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };

  const updatedTable = {
    ...req.body.table,
    table_id: res.locals.table.table_id,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const output = await tablesService.update(updatedTable, updatedReservation);
  res.json({ output });
}

async function finish(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: "finished",
  };

  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
    reservation_id: null,
  };
  const output = await tablesService.update(updatedTable, updatedReservation);
  res.json({ output });
}

function reservationExists(req, res, next) {
  let reservation_Id = null;
  if (req.body.data) {
    reservation_Id = req.body.data.reservation_id;
  } else {
    reservation_Id = res.locals.table.reservation_id;
  }
  reservationsService
    .read(reservation_Id)
    .then((reservation) => {
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
      next({ status: 404, message: `${reservation_Id} cannot be found.` });
    })
    .catch(next);
}

function checkTableCapacity(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;

  if (table.capacity >= reservation.people) {
    return next();
  }
  next({ status: 400, message: "Table does not have sufficient capacity" });
}

function checkReservationSeated(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status !== "seated") {
    return next();
  }
  next({ status: 400, message: "Reservation party is already seated" });
}

function checkTableAvaible(req, res, next) {
  const table = res.locals.table;

  if (!table.reservation_id) {
    return next();
  }
  next({ status: 400, message: "Table is currently occupied" });
}

function checkTableOccupied(req, res, next) {
  const table = res.locals.table;

  if (table.reservation_id) {
    return next();
  }
  next({ status: 400, message: "Table is not occupied" });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  create: [
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(validateName),
    asyncErrorBoundary(validateCapacity),
    asyncErrorBoundary(validateCapacityValue),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(hasReservationId),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(checkTableAvaible),
    asyncErrorBoundary(checkTableCapacity),
    asyncErrorBoundary(checkReservationSeated),
    asyncErrorBoundary(update),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(checkTableOccupied),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(finish),
  ],
};