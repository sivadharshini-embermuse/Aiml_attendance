import { useEffect, useState } from "react";
import "./Home.css"
function AdminDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://aiml-attendance.onrender.com/admin-dashboard")
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="admin-dsb">
      <h1 className="deptname">Lab Analytics Dashboard</h1>
      <p>Students Today: {data.studentsToday}</p>
      <p>Currently in Lab: {data.activeStudents}</p>
      <p>Total Checkouts: {data.totalCheckouts}</p>
      <p>Average Usage Time: {data.averageUsage}</p>
      <h2>Most Used Systems</h2>
      {data.systems.map(sys => (
        <p key={sys.system_no}>
          {sys.system_no} : {sys.system_usage}
        </p>
      ))}

    </div>
  );
}

export default AdminDashboard;