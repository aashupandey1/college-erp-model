// src/App.jsx

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PortalAccess from "./components/PortalAccess";
import WhyChoose from "./components/WhyChoose";
import ModulesSection from "./components/ModulesSection";
import Footer from "./components/Footer";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard/Admin/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import FacultyPortal from "./pages/FacultyDashboard/FacultyDashboard";
import useScrollFadeIn from "./hooks/useScrollFadeIn";
import HODDashboard from "./pages/HODdashboard/HODDashboard";
import ParentDashboard from "./pages/ParentDashboard/ParentDashboard";
import AccountantDashboard from "./pages/Accountantdashboard/Accountantdashboard";

function HomePage() {
  useScrollFadeIn();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PortalAccess />
        <WhyChoose />
        <ModulesSection />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/login/:role"
        element={<LoginPage />}
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/HOD"
        element={
          <ProtectedRoute allowedRole="hod">
            <HODDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Parent"
        element={
          <ProtectedRoute allowedRole="parent">
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Accountant"
        element={
          <ProtectedRoute allowedRole="accountant">
            <AccountantDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}