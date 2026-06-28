import './StudentIdCardPage.css'
function StudentIdCardPage({ student, onNav }) {
  if (!student) {
    return <h2>No Student Selected</h2>;
  }

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Student ID Card</div>
          <div className="ad-page-sub">
            ID Card Preview
          </div>
        </div>

        <button
          className="ad-btn-outline"
          onClick={() => onNav("studentProfile", student)}
        >
          Back
        </button>
      </div>

      <div className="id-card">
        <div className="id-header">
          COLLEGE ERP
        </div>

        <div className="id-body">
          <div className="id-photo">
            {student.name
              .split(" ")
              .map(n => n[0])
              .join("")}
          </div>

          <h3>{student.name}</h3>

          <p>ID: {student.id}</p>
          <p>Branch: {student.branch}</p>
          <p>Batch: {student.batch}</p>
          <p>Section: {student.section}</p>
          <p>Status: {student.status}</p>
        </div>
      </div>
    </>
  );
}

export default StudentIdCardPage;