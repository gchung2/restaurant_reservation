import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  listTables,
  listReservations,
  finishTables,
  cancelReservations,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCardList from "../reservations/ReservationCardList";
import TableList from "../tables/TableList";
import ChangedDate from "./ChangedDate";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }

  function finishTable(table_id) {
    const abortController = new AbortController();

    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (result) {
      setTablesError(null);
      finishTables(table_id, abortController.signal)
        .then(() => {
          history.push("/");
        })
        .catch(setTablesError);
    }

    return () => abortController.abort();
  }

  function cancelReservation(reservation_id) {
    const abortController = new AbortController();

    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      setReservationsError(null);
      cancelReservations(reservation_id, abortController.signal)
        .then(() => {
          history.push("/");
        })
        .catch(setReservationsError);
    }

    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="display-4">Dashboard</h1>
      <ChangedDate date={date} setDate={setDate} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0 mt-4 h4">Reservations for Date {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationCardList
        reservations={reservations}
        cancelReservation={cancelReservation}
      />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0 mt-5 h4">Tables</h4>
      </div>
      <ErrorAlert error={tablesError} />
      <TableList tables={tables} finishTable={finishTable} />
    </main>
  );
}

export default Dashboard;