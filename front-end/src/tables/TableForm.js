import React from "react";
import { useHistory } from "react-router-dom";
import CancelButton from "../layout/CancelButton";

function TableForm({ formData, setFormData, deckFunction, setTablesError }) {
  const history = useHistory();
  const handleChange = ({ target }) => {
    let isMounted = true;
    if (isMounted) {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
    return () => {
      isMounted = false;
    };
  };

  const submitHandler = async (event) => {
    let abortController = new AbortController();

    event.preventDefault();
    setFormData({ ...formData });

    deckFunction(formData, abortController.signal)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        setTablesError(error);
        setFormData(formData);
      });

    return () => {
      abortController.abort();
    };
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label htmlFor="table_name" className="form-label">
          Table Name
        </label>
        <input
          className="form-control"
          id="table_name"
          type="text"
          name="table_name"
          placeholder="Table Name"
          onChange={handleChange}
          value={formData.table_name}
        />
      </div>
      <div className="form-group">
        <label htmlFor="capacity" className="form-label">
          Capacity
        </label>
        <input
          className="form-control"
          id="capacity"
          type="number"
          name="capacity"
          min="1"
          placeholder="Capacity"
          onChange={handleChange}
          value={formData.capacity}
        />
      </div>

      <CancelButton />
      <button type="submit" className="btn btn-primary mx-3">
        Submit
      </button>
    </form>
  );
}

export default TableForm;