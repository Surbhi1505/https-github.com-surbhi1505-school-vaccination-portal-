import React, { useState, useEffect } from 'react';
import api from '../api';
import PageTitle from '../components/PageTitle';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Table from '../components/Table';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Drives() {
  const [form, setForm] = useState({
    vaccine_name: '',
    date: '',
    doses_available: '',
    applicable_classes: ''
  });
  const [drives, setDrives] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editDrive, setEditDrive] = useState(null);

  const fetchDrives = async () => {
    const res = await api.get('/drives/');
    setDrives(res.data);
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/drives/', form);
      toast.success('Drive scheduled');
      setForm({
        vaccine_name: '',
        date: '',
        doses_available: '',
        applicable_classes: ''
      });
      fetchDrives();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Drive creation failed');
    }
  };

  const handleEditClick = (drive) => {
    setEditDrive({ ...drive });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/drives/${editDrive.id}`, editDrive);
      toast.success('Drive updated');
      setEditDrive(null);
      fetchDrives();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="container">
      {/* Title */}
      <div className="dashboard-header">
        <h1>💉 Vaccination Drives</h1>
        <p>Create and manage student vaccination drives.</p>
      </div>

      {/* Create Form */}
      <Card>
        <div className="section-header">
          <h3>➕ Schedule New Drive</h3>
          <button className="orange-button" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {showAddForm && (
          <form onSubmit={handleSubmit} className="form-row">
            <FormInput
              label="Vaccine Name"
              value={form.vaccine_name}
              onChange={(e) => setForm({ ...form, vaccine_name: e.target.value })}
              required
              style={{ flex: '1 1 200px' }}
            />
            <FormInput
              label="Drive Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              style={{ flex: '1 1 200px' }}
            />
            <FormInput
              label="Available Doses"
              type="number"
              value={form.doses_available}
              onChange={(e) => setForm({ ...form, doses_available: e.target.value })}
              required
              style={{ flex: '1 1 180px' }}
            />
            <FormInput
              label="Applicable Classes"
              value={form.applicable_classes}
              onChange={(e) => setForm({ ...form, applicable_classes: e.target.value })}
              required
              style={{ flex: '1 1 180px' }}
            />
            <button type="submit" className="orange-button">Create Drive</button>
          </form>
        )}
      </Card>

      {/* Drives Table */}
      <Card>
        <h3>📋 Scheduled Drives</h3>
        <Table
          headers={['ID', 'Vaccine Name', 'Date', 'Doses', 'Applicable Classes','Remaining Doses', 'Actions']}
          rows={drives.map((d) => ({
            'ID': d.id,
            'Vaccine Name': d.vaccine_name,
            'Date': d.date,
            'Doses': d.doses_available,
            'Applicable Classes': d.applicable_classes,
            'Remaining Doses':d.remaining_doses,
            'Actions': new Date(d.date) > new Date()
              ? <button onClick={() => handleEditClick(d)} className="orange-button">✏️ Edit</button>
              : <span style={{ color: 'gray' }}>🔒 Locked</span>
          }))}
        />
      </Card>

      {/* Edit Modal */}
      {editDrive && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Vaccination Drive</h3>
            <form onSubmit={handleUpdate}>
              <FormInput
                label="Vaccine Name"
                value={editDrive.vaccine_name}
                onChange={(e) => setEditDrive({ ...editDrive, vaccine_name: e.target.value })}
              />
              <FormInput
                label="Drive Date"
                type="date"
                value={editDrive.date}
                onChange={(e) => setEditDrive({ ...editDrive, date: e.target.value })}
              />
              <FormInput
                label="Available Doses"
                type="number"
                value={editDrive.doses_available}
                onChange={(e) => setEditDrive({ ...editDrive, doses_available: e.target.value })}
              />
              <FormInput
                label="Applicable Classes"
                value={editDrive.applicable_classes}
                onChange={(e) => setEditDrive({ ...editDrive, applicable_classes: e.target.value })}
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="orange-button">Save</button>
                <button type="button" onClick={() => setEditDrive(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
