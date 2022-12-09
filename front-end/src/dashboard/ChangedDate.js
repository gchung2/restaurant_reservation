import { today, previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ChangedDate({ date, setDate }) {
  const handleNextClick = () => {
    const nextDate = next(date);
    setDate(nextDate);
  };

  const handlePreviousClick = () => {
    const previousDate = previous(date);
    setDate(previousDate);
  };

  const handleTodayClick = () => {
    setDate(today());
  };

  return (
    <div className="btn-group" role="group" aria-label="Basic example">
      <button
        type="button"
        className="btn btn-info"
        onClick={() => handlePreviousClick()}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn btn-primary mx-1"
        onClick={() => handleTodayClick()}
      >
        Today
      </button>
      <button
        type="button"
        className="btn btn-info"
        onClick={() => handleNextClick()}
      >
        Next
      </button>
    </div>
  );
}

export default ChangedDate;