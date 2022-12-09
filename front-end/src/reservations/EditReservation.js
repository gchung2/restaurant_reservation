
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { readReservation, updateReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {
  const [reservationsError, setReservationsError] = useState(null);
  const [reservation, setReservation] = useState([]);

  const { reservationsId } = useParams();

  useEffect(() => {
    async function loadReservation(reservationsId) {
      const abortController = new AbortController();

      readReservation(reservationsId, abortController.signal)
        .then(setReservation)
        .catch(setReservationsError);
      return () => abortController.abort();
    }

    loadReservation(reservationsId);
  }, [reservationsId]);

  if (reservation.reservation_id) {
    return (
      <section>
        <h2 className="display-4">Edit Reservation</h2>
        <ErrorAlert error={reservationsError} />
        <ReservationForm
          initialFormState={reservation}
          reservationFunction={updateReservations}
          setReservationsError={setReservationsError}
        />
      </section>
    );
  } else {
    return null;
  }
}

export default EditReservation;