import React from 'react';

export default function Table({ headers = [], rows = [] }) {
  return (
    <table className="styled-table">
      <thead>
        <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {headers.map((h, j) => <td key={j}>{row[h]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
