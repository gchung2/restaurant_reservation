import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationCardList({ reservations, cancelReservation }) {
  if (reservations.length > 0) {
    return (
      <div className="row">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.reservation_id}
            reservation={reservation}
            cancelReservation={() =>
              cancelReservation(reservation.reservation_id)
            }
          ></ReservationCard>
        ))}
      </div>
    );
  }
  return "No reservations found";
}

export default ReservationCardList;