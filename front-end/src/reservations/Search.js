
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { searchReservations, cancelReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCardList from "./ReservationCardList";

function Search() {
  let initialFormState = { mobile_number: "" };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const history = useHistory();
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const submitHandler = async (event) => {
    let abortController = new AbortController();

    event.preventDefault();
    setFormData({ ...initialFormState });

    const mobile_number = formData.mobile_number;
    searchReservations(mobile_number, abortController.signal)
      .then((response) => {
        setReservations(response);
      })
      .catch((error) => {
        setReservationsError(error);
        setFormData(formData);
      });

    return () => {
      abortController.abort();
    };
  };

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
      <h1 className="display-4">Search Using Mobile Number</h1>
      <div>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="mobile_number" className="form-label">
              Mobile Number
            </label>
            <input
              className="form-control"
              id="mobile_number"
              type="text"
              name="mobile_number"
              placeholder="(___)-___-_____"
              onChange={handleChange}
              value={formData.mobile_number}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>
      <div>
        <ErrorAlert error={reservationsError} />
        <div>
          <h4 className="mb-0 my-3 h4">Search Result</h4>
          <ReservationCardList
            reservations={reservations}
            cancelReservation={cancelReservation}
          />
        </div>
      </div>
    </main>
  );
}

export default Search;