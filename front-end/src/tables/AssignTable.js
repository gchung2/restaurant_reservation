
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, listTables, assignTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import CancelButton from "../layout/CancelButton";

function AssignTable() {
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [tableId, setTableId] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  const { reservationsId } = useParams();
  const history = useHistory();

  useEffect(() => {
    async function loadTables() {
      const abortController = new AbortController();

      listTables({}, abortController.signal).then(setTables);
      return () => abortController.abort();
    }

    async function loadReservation(reservationsId) {
      const abortController = new AbortController();

      readReservation(reservationsId, abortController.signal).then(
        setReservation
      );
      return () => abortController.abort();
    }

    loadTables();
    loadReservation(reservationsId);
  }, [reservationsId]);

  const submitHandler = async (event) => {
    let abortController = new AbortController();

    event.preventDefault();
    const reservation = { reservation_id: reservationsId };

    assignTable(tableId, reservation, abortController.signal)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        setTablesError(error);
      });

    return () => {
      abortController.abort();
    };
  };

  if (tables) {
    return (
      <main>
        <h1 className="display-4">Seat Assignment</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0 h4">
            Assigning seat for {reservation.first_name} for {reservation.people}{" "}
            people
          </h4>
        </div>
        <ErrorAlert error={tablesError} />
        <form onSubmit={submitHandler}>
          <label htmlFor="table_id">
            Assign seat
            <select
              id="table_id"
              name="table_id"
              onChange={(event) => setTableId(event.target.value)}
              value={tableId}
            >
              {tables.map((table) => (
                <option key={table.table_id} value={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
              ;
            </select>
          </label>
          <button type="submit" className="btn btn-primary mx-3">
            Assign
          </button>
        </form>
        <CancelButton />
      </main>
    );
  }
  return "Loading..";
}

export default AssignTable;