import React, { useState } from "react";
import TableForm from "./TableForm";
import { createTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable() {
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [tablesError, setTablesError] = useState(null);

  return (
    <section>
      <h2 className="display-4">New Table</h2>
      <ErrorAlert error={tablesError} />
      <TableForm
        formData={formData}
        setFormData={setFormData}
        deckFunction={createTables}
        setTablesError={setTablesError}
      />
    </section>
  );
}

export default CreateTable;