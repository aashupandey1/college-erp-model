import { useState } from "react";
import "./AdminDashboard.css";

import Shell from "../components/Shell";
import { apiFetch } from "../../../services/api";
import DashboardPage from "./DashboardPage";
import StudentsPage from "./StudentsPage";
import FacultyPage from "./FacultyPage";
import AttendancePage from "./AttendancePage";
import ExamsPage from "./ExamsPage";
import FeesPage from "./FeesPage";
import HostelPage from "./HostelPage";
import TransportPage from "./TransportPage";
import PlacementPage from "./PlacementPage";
import LibraryPage from "./LibraryPage";
import GrievancePage from "./GrievancePage";
import ScholarshipPage from "./ScholarshipPage";
import CommunicationPage from "./CommunicationPage";
import HRStaffPage from "./HRStaffPage";
import AlumniPage from "./AlumniPage";
import ResearchPage from "./ResearchPage";
import InventoryPage from "./InventoryPage";
import AccountsPage from "./AccountsPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import StudentProfileView from "../Students/StudentProfileView";
import AddStudentPage from "../Students/AddStudentPage";
import EditStudentPage from "../Students/EditStudentPage";
import StudentIdCardPage from "../Students/StudentIdCardPage";
import AdmissionsPage from "../Students/AdmissionsPage"
import AddFacultyPage from "../Faculty/AddFacultyPage";
import FacultyProfileView from "../Faculty/FacultyProfileView";
import EditFacultyPage from "../Faculty/EditFacultyPage";
/* ════════════════════════════════════════
   MAIN EXPORT — AdminDashboard
════════════════════════════════════════ */
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // ✅ Nav handler upgrade — page + optional data
  const handleNav = (page, data = null) => {
    setActive(page);

    if (page === "studentProfile" || page === "editStudent" || page === "studentIdCard") {
      if (data) setSelectedStudent(data);
    }

    if (page === "facultyProfile" || page === "editFaculty") {
      setSelectedFaculty(data);
    }
  };

  const renderPage = () => {
    switch (active) {
      case "dashboard":
        return <DashboardPage />;
      case "students":
        return <StudentsPage onNav={handleNav} />;
      case "faculty":
        return <FacultyPage onNav={handleNav} />;
      case "addFaculty":
        return (
          <AddFacultyPage
            onBack={() => setActive("faculty")}
            onSave={async (newFaculty) => {
              try {
                await apiFetch("/faculty", {
                  method: "POST",
                  body: JSON.stringify(newFaculty),
                });

                alert("Faculty added successfully");
                setActive("faculty");
              } catch (err) {
                alert(err.message);
              }
            }}
          />
        );
      case "facultyProfile":
        return (
          <FacultyProfileView
            faculty={selectedFaculty}
            onBack={() => setActive("faculty")}
            onNav={handleNav}
          />
        );
      case "editFaculty":
        return (
          <EditFacultyPage
            faculty={selectedFaculty}
            onBack={() => setActive("facultyProfile")}
            onUpdate={(updatedFaculty) => {

              setFacultyList((prev) =>
                prev.map((item) => {
                  if (item.id === updatedFaculty.id) {
                    return {
                      ...item,
                      ...updatedFaculty,
                    };
                  }
                  return item;
                })
              );

              setSelectedFaculty(updatedFaculty);

              setActive("facultyProfile");
            }}
          />
        );
      case "attendance":
        return <AttendancePage />;
      case "exams":
        return <ExamsPage />;
      case "fees":
        return <FeesPage />;
      case "hostel":
        return <HostelPage />;
      case "transport":
        return <TransportPage />;
      case "placement":
        return <PlacementPage />;
      case "library":
        return <LibraryPage />;
      case "grievance":
        return <GrievancePage />;
      case "scholarship":
        return <ScholarshipPage />;
      case "studentProfile":
        return (
          <StudentProfileView
            student={selectedStudent}
            onClose={() => setActive("students")}
            onNav={handleNav}
          />
        );

      case "addStudent":
        return <AddStudentPage
          onSuccess={() => {
            setActive("students");
          }}
        />;
      case "editStudent":
        return (
          <EditStudentPage
            student={selectedStudent}
            onNav={handleNav}
            onCancel={() => setActive("studentProfile")}
            onUpdated={(updatedStudent) => {
              setSelectedStudent(updatedStudent);
              handleNav("studentProfile", updatedStudent);
            }}
          />
        );

      case "studentIdCard":
        return (
          <StudentIdCardPage
            student={selectedStudent}
            onNav={handleNav}
          />
        );
      case "admissions":
        return (
          <AdmissionsPage
            onClose={() => setActive("students")}
          />
        );

      case "communication":
        return <CommunicationPage />;

      case "hrstaff":
        return <HRStaffPage />;

      case "alumni":
        return <AlumniPage />;

      case "research":
        return <ResearchPage />;

      case "inventory":
        return <InventoryPage />;

      case "accounts":
        return <AccountsPage />;

      case "reports":
        return <ReportsPage />;

      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Shell active={active} onNav={setActive}>
      {renderPage()}
    </Shell>
  );
}