import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line
} from 'recharts';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';

export default function Dashboard() {
  const [data, setData] = useState({});
  const [recent, setRecent] = useState([]);
  const [classStats, setClassStats] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    api.get('/dashboard/').then(res => setData(res.data));
    api.get('/dashboard/activity').then(res => setRecent(res.data));
    api.get('/dashboard/classwise').then(res => setClassStats(res.data));
    api.get('/dashboard/dailywise').then(res => setDailyStats(res.data));
  }, []);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>📘 School Vaccination Dashboard</h1>
        <p>Welcome! Here’s an overview of student vaccination progress.</p>
      </div>

      {/* Stat Tiles */}
      <div className="dashboard-grid">
        <Card className="stat-card orange">
          <h3>👨‍🎓 Total Students</h3>
          <p className="stat-number">{data.total_students ?? '—'}</p>
        </Card>
        <Card className="stat-card green">
          <h3>✅ Vaccinated</h3>
          <p className="stat-number">{data.vaccinated ?? '—'}</p>
          <p className="subtext">
            {data.total_students === 0
              ? 'No students'
              : data.vaccinated_percentage != null
              ? `(${data.vaccinated_percentage}%)`
              : ''}
          </p>
        </Card>
        <Card className="stat-card blue">
          <h3>📅 Upcoming Drives</h3>
          <p className="stat-number">{data.upcoming_drives ?? '—'}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="dashboard-grid" style={{ marginTop: '40px' }}>
        <Card>
          <h3>📊 Vaccinated Students by Class</h3>
          {classStats.length === 0 ? (
            <p>No class-wise data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3>📈 Vaccinations Over Time</h3>
          {dailyStats.length === 0 ? (
            <p>No vaccination data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card style={{ marginTop: '40px' }}>
        <h3>📝 Recent Vaccinations</h3>
        {recent.length === 0 ? (
          <p>No recent vaccination activity</p>
        ) : (
          <ul>
            {recent.map((r, i) => (
              <li key={i}>
                <strong>{r.student}</strong> ({r.class}) got <em>{r.vaccine}</em> on {r.date}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
