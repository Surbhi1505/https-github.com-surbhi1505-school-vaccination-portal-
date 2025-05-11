import React, { useEffect, useState } from "react";
import api from "../api";
import PageTitle from "../components/PageTitle";
import Card from "../components/Card";
import Table from "../components/Table";

export default function Reports() {
  const [records, setRecords] = useState([]);

  const fetchReports = async () => {
    const res = await api.get("/reports/");
    setRecords(res.data);
  };

  const handleExport = async () => {
    const res = await api.get("/reports/export", { responseType: "blob" });
    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vaccination_report.csv";
    a.click();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container">
      {/* <PageTitle text="📄 Vaccination Reports" /> */}

      <div className="dashboard-header">
        <h1>📄 Vaccination Reports</h1>
        <p>Search and Download Reports</p>
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",   
            justifyContent: "right",
          }}
        >
          <button onClick={handleExport}>⬇ Export CSV</button>
        </div>
        <Table
          headers={["student_id", "name", "class", "vaccine", "date"]}
          rows={records}
        />
      </Card>
    </div>
  );
}
