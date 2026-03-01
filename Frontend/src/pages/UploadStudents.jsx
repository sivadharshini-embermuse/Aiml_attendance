import "./Home.css"
import { useNavigate } from "react-router-dom";

function UploadStudents() {
  const navigate = useNavigate();
  return (
    <div className="uploading">
      <h2 className="deptname">Upload Student Excel</h2>

      <form
        action="https://aiml-lab-attendence-1.onrender.com/upload-students"
        method="post"
        encType="multipart/form-data"
        className="ooo"
      >
        <input className="inputseting" type="file" name="file" accept=".xlsx,.csv" required />
        <br /><br />
        <div className="buttonkacenter">
          <button className="buttonuu" type="submit">Upload</button>
          <button
          className="buttonuu"
          type="button"
          onClick={() =>
            window.location.href = "https://aiml-lab-attendence-1.onrender.com/download-entry"
          }
          >
            Download Entry Excel
          </button>
        </div>
      </form>
      
      <hr style={{ margin: "30px 0" }} />
      <button 
        onClick={() => navigate("/admin")}
        className="dashboard-btn"
      >
        View Admin Dashboard
      </button>
          </div>
  );
}

export default UploadStudents;
