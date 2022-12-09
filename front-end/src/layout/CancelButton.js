import React from "react";
import { useHistory } from "react-router-dom";

function CancelButton() {
  const history = useHistory();
  return (
    <button className="btn btn-secondary" onClick={() => history.goBack()}>
      Cancel
    </button>
  );
}

export default CancelButton;