import React, { useEffect, useState } from "react";
import api from "../api";
import Card from "../components/Card";
import FormInput from "../components/FormInput";
import Table from "../components/Table";
import PageTitle from "../components/PageTitle";
import { toast } from "react-toastify";
import {
  FaPlusCircle,
  FaUpload,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
} from "react-icons/fa";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    class_grade: "",
    vaccinated: "",
  });
  const [form, setForm] = useState({ name: "", class_grade: "" });
  const [file, setFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

  const fetchStudents = async () => {
    const res = await api.get("/students/", { params: filters });
    const statuses = await api.get("/reports/");
    const vaccinatedIds = new Set(statuses.data.map((v) => v.student_id));
    const enriched = res.data.map((s) => ({
      ...s,
      vaccinated: vaccinatedIds.has(s.id) ? "✅ Yes" : "❌ No",
    }));
    setStudents(enriched);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.class_grade) return toast.error("Fill all fields");
    await api.post("/students/", form);
    setForm({ name: "", class_grade: "" });
    toast.success("Student added");
    fetchStudents();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/students/upload", formData);
    setFile(null);
    setShowUploadModal(false);
    toast.success("CSV uploaded");
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this student?")) {
      await api.delete(`/students/${id}`);
      toast.success("Student deleted");
      fetchStudents();
    }
  };

  const handleVaccinate = async (studentId) => {
    const driveId = prompt("Enter Drive ID to mark vaccination:");
    if (!driveId) return;
    try {
      await api.post("/vaccination/mark", {
        student_id: studentId,
        drive_id: driveId,
      });
      toast.success("Vaccination marked");
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.error || "Already vaccinated or error");
    }
  };

  const runQuery = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>📘 Student Vaccination Overview</h1>
        <p>
          Search, add, manage and vaccinate students from this dashboard-style
          screen.
        </p>
      </div>

      {/* Add Student Section */}
      <Card>
        <div className="section-header">
          <h3>➕ Add Student</h3>
          <button
            className="orange-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {showAddForm && (
          <form onSubmit={handleAdd} className="form-row">
            <FormInput
              label="Student Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ flex: "1 1 250px" }}
            />
            <FormInput
              label="Class Grade"
              value={form.class_grade}
              onChange={(e) =>
                setForm({ ...form, class_grade: e.target.value })
              }
              style={{ flex: "1 1 200px" }}
            />
            <div style={{  marginBottom:"15px"}}>
              <button type="submit" className="orange-button">
                Add
              </button>
            </div>
          </form>
        )}

        {showAddForm && (
          <button
            className="orange-button"
            onClick={() => setShowUploadModal(true)}
          >
            <FaUpload /> Upload CSV
          </button>
        )}
      </Card>

      {/* Filter Query Section */}
      <Card>
        <div className="section-header">
          <h3>
            <FaSearch /> Filter Students
          </h3>
          <button
            className="orange-button"
            onClick={() => setShowSearchForm(!showSearchForm)}
          >
            {showSearchForm ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {showSearchForm && (
          <form onSubmit={runQuery} className="form-row">
            <FormInput
              label="ID"
              type="number"
              value={filters.id}
              onChange={(e) => setFilters({ ...filters, id: e.target.value })}
            />
            <FormInput
              label="Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <FormInput
              label="Class"
              value={filters.class_grade}
              onChange={(e) =>
                setFilters({ ...filters, class_grade: e.target.value })
              }
            />
            <div style={{ marginLeft: "5px", marginBottom: "15px" }}>
              <label
                style={{
                  marginTop: "10px",
                  marginBottom: "15px",
                  display: "inline-block",
                }}
              >
                Vaccinated
              </label>
              <select
                value={filters.vaccinated}
                style={{ height: "30px", padding: "2px 10px", width: "100%" }}
                onChange={(e) =>
                  setFilters({ ...filters, vaccinated: e.target.value })
                }
              >
                <option value="">-- Any --</option>
                <option value="yes">✅ Yes</option>
                <option value="no">❌ No</option>
              </select>
            </div>

            <div style={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
              <button type="submit" className="orange-button">
                Run Query
              </button>
            </div>
          </form>
        )}
      </Card>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload CSV</h3>
            <form onSubmit={handleUpload}>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <button type="submit" className="orange-button">
                Upload
              </button>
              <button type="button" onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table Section */}
      <Card>
        <h3>📋 Student List</h3>
        <Table
          headers={[
            "Student ID",
            "Full Name",
            "Class",
            "Vaccinated",
            "Actions",
          ]}
          rows={students.map((s) => ({
            "Student ID": s.id,
            "Full Name": s.name,
            Class: s.class_grade,
            Vaccinated: s.vaccinated,
            Actions: (
              <>
                <button onClick={() => handleDelete(s.id)}>🗑 Delete</button>
                <button
                  onClick={() => handleVaccinate(s.id)}
                  style={{ marginLeft: "10px" }}
                >
                  ✅ Vaccinate
                </button>
              </>
            ),
          }))}
        />
      </Card>
    </div>
  );
}
