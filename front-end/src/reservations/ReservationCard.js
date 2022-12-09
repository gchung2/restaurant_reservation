
import React from "react";
import { Link } from "react-router-dom";

function ReservationCard({ reservation, cancelReservation }) {
  let seatButton;
  let editButton;
  let cancelButton;
  if (reservation.status === "booked") {
    seatButton = (
      <Link to={`/reservations/${reservation.reservation_id}/seat`}>
        <button className="btn btn-secondary">Seat</button>
      </Link>
    );
    editButton = (
      <Link to={`/reservations/${reservation.reservation_id}/edit`}>
        <button className="btn btn-warning mx-2">Edit</button>
      </Link>
    );
  }

  if (reservation.status !== "cancelled") {
    cancelButton = (
      <button
        className="btn btn-danger mx-2"
        name="put"
        onClick={cancelReservation}
      >
        Cancel
      </button>
    );
  }

  return (
    <div className="card mx-1">
      <div className="card-body">
        <h5 className="card-title">
          {reservation.first_name} {reservation.last_name}
        </h5>
        <p className="card-text">Contact {reservation.mobile_number}</p>
        <p className="card-text">Party of {reservation.people}</p>
        <p className="card-text">
          {" "}
          {reservation.reservation_date} at {reservation.reservation_time}
        </p>
        <h6
          className="card-title"
          data-reservation-id-status={reservation.reservation_id}
        >
          {reservation.status}
        </h6>
        <div className="row">
          <div data-reservation-id-cancel={reservation.reservation_id}>
            {cancelButton}
          </div>
          <div>{editButton}</div>
          <div>{seatButton}</div>
        </div>
      </div>
    </div>
  );
}

export default ReservationCard;