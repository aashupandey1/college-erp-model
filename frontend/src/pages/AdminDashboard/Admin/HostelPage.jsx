import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

const formatCurrency = (n) => {
  const num = Number(n) || 0;
  try {
    return num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  } catch {
    return String(num);
  }
};

const formatCompact = (n) => {
  const num = Number(n) || 0;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${formatCurrency(num)}`;
};

const getRoomCellClass = (room) => {
  if (room.status === "Maintenance") return "room-main";
  if ((room.occupied || 0) >= (room.capacity || 1)) return "room-occ";
  if ((room.occupied || 0) > 0) return "room-part";
  return "room-free";
};

const getRoomCellLabel = (room) => {
  if (room.status === "Maintenance") return "Maint.";
  if ((room.occupied || 0) >= (room.capacity || 1)) return "Full";
  if ((room.occupied || 0) > 0) return `${room.occupied}/${room.capacity}`;
  return "Free";
};

const statusPillClass = (status) => {
  if (status === "Occupied") return "pill-amber";
  if (status === "Available") return "pill-green";
  if (status === "Maintenance") return "pill-gray";
  return "pill-blue";
};

const grievancePillClass = (status) => {
  if (status === "Open") return "pill-red";
  if (status === "In Progress") return "pill-amber";
  if (status === "Resolved") return "pill-green";
  return "pill-gray";
};

const isHostelGrievance = (g) => {
  const text = `${g.category || ""} ${g.description || ""}`.toLowerCase();
  return /hostel|mess|room|warden|block/.test(text);
};

const emptyAllotForm = () => ({
  roomId: "",
  studentId: "",
});

/* ════════════════════════════════════════
   PAGE 7 — HOSTEL
════════════════════════════════════════ */
function HostelPage() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAllotForm, setShowAllotForm] = useState(false);
  const [allotForm, setAllotForm] = useState(emptyAllotForm());
  const [blockFilter, setBlockFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);

  const emptyRoomForm = {
    roomNumber: "",
    block: "",
    capacity: 2,
    type: "Shared",
    rent: "",
    status: "Available",
  };

  const [roomForm, setRoomForm] = useState(emptyRoomForm);
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [roomsRes, studentsRes, grievancesRes, feesRes] = await Promise.all([
        apiFetch("/hostel"),
        apiFetch("/students"),
        apiFetch("/grievances"),
        apiFetch("/fees"),
      ]);

      setRooms(roomsRes?.data || []);
      setStudents(studentsRes?.data || []);
      setGrievances(grievancesRes?.data || []);
      setFees(feesRes?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load hostel data");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const blockOptions = useMemo(
    () => [...new Set((Array.isArray(rooms) ? rooms : []).map((r) => r.block).filter(Boolean))].sort(),
    [rooms]
  );

  const kpiStats = useMemo(() => {
    const list = Array.isArray(rooms) ? rooms : [];
    const occupiedRooms = list.filter(
      (r) => r.status === "Occupied" || (r.occupied || 0) >= (r.capacity || 1)
    ).length;
    const vacantRooms = list.filter(
      (r) => r.status === "Available" && (r.occupied || 0) < (r.capacity || 1)
    ).length;
    const openComplaints = (Array.isArray(grievances) ? grievances : []).filter(
      (g) => isHostelGrievance(g) && (g.status === "Open" || g.status === "In Progress")
    ).length;
    const hostelFees = (Array.isArray(fees) ? fees : [])
      .filter((f) => /hostel/i.test(f.feeType || "") && (f.status === "Paid" || f.status === "Partially Paid"))
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    return { occupiedRooms, vacantRooms, openComplaints, hostelFees };
  }, [rooms, grievances, fees]);

  const filteredRooms = useMemo(() => {
    return (Array.isArray(rooms) ? rooms : [])
      .filter((r) => {
        const matchesBlock = blockFilter === "All" || r.block === blockFilter;
        const label = `${r.roomNumber || ""} ${r.block || ""}`.toLowerCase();
        const matchesSearch = label.includes(searchTerm.toLowerCase());
        return matchesBlock && matchesSearch;
      })
      .sort((a, b) => (a.roomNumber || "").localeCompare(b.roomNumber || ""));
  }, [rooms, blockFilter, searchTerm]);

  const mapRooms = filteredRooms.slice(0, 24);

  const hostelComplaints = useMemo(
    () =>
      (Array.isArray(grievances) ? grievances : [])
        .filter(isHostelGrievance)
        .sort((a, b) => new Date(b.filedDate || b.createdAt) - new Date(a.filedDate || a.createdAt))
        .slice(0, 5),
    [grievances]
  );

  const allotments = useMemo(
    () =>
      (Array.isArray(rooms) ? rooms : []).filter(
        (r) => Array.isArray(r.assignedStudents) && r.assignedStudents.length > 0
      ),
    [rooms]
  );

  const pageSubtitle = useMemo(() => {
    const blocks = blockOptions.length ? blockOptions.join(", ") : "No blocks";
    const date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${blocks} · ${date}`;
  }, [blockOptions]);

  const handleAllotRoom = async () => {
    if (!allotForm.roomId || !allotForm.studentId) {
      window.alert("Please select both room and student.");
      return;
    }

    const room = rooms.find((r) => r._id === allotForm.roomId);
    const alreadyAssigned = rooms.some((r) =>
      (r.assignedStudents || []).some(
        (s) => String(s?._id || s) === String(allotForm.studentId)
      )
    );

    if (alreadyAssigned) {
      window.alert("Student is already allotted to another room.");
      return;
    }
    if (!room) return;

    const existingIds = (room.assignedStudents || []).map((s) =>
      String(s?._id || s)
    );

    if (existingIds.includes(String(allotForm.studentId))) {
      window.alert("Student is already allotted to this room.");
      return;
    }

    if ((room.occupied || 0) >= (room.capacity || 1)) {
      window.alert("Room is at full capacity.");
      return;
    }

    setSaving(true);
    try {
      const assignedStudents = [...existingIds, allotForm.studentId];
      const occupied = assignedStudents.length;
      const status =
        occupied >= (room.capacity || 1)
          ? "Occupied"
          : occupied > 0
            ? "Occupied"
            : "Available";

      await apiFetch(`/hostel/${room._id}`, {
        method: "PUT",
        body: JSON.stringify({ assignedStudents, occupied, status }),
      });

      setAllotForm(emptyAllotForm());
      setShowAllotForm(false);
      await loadData();
      window.alert("Room allotted successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to allot room");
    } finally {
      setSaving(false);
    }
  };

  const handleVacate = async (room, studentId) => {
    const ok = window.confirm("Remove student from this room?");
    if (!ok) return;

    try {
      const assignedStudents = (room.assignedStudents || [])
        .map((s) => String(s?._id || s))
        .filter((id) => id !== String(studentId));

      const occupied = assignedStudents.length;
      const status = occupied > 0 ? "Occupied" : "Available";

      await apiFetch(`/hostel/${room._id}`, {
        method: "PUT",
        body: JSON.stringify({ assignedStudents, occupied, status }),
      });

      await loadData();
      window.alert("Room vacated successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to vacate room");
    }
  };
  const handleSaveRoom = async () => {
    if (!roomForm.roomNumber.trim()) {
      window.alert("Room Number is required.");
      return;
    }

    if (!roomForm.block.trim()) {
      window.alert("Block is required.");
      return;
    }

    if (Number(roomForm.capacity) <= 0) {
      window.alert("Capacity must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      await apiFetch("/hostel", {
        method: "POST",
        body: JSON.stringify({
          roomNumber: roomForm.roomNumber.trim().toUpperCase(),
          block: roomForm.block.trim().toUpperCase(),
          capacity: Number(roomForm.capacity),
          occupied: 0,
          type: roomForm.type,
          rent: Number(roomForm.rent) || 0,
          status: roomForm.status,
          assignedStudents: [],
        }),
      });

      window.alert("Room added successfully.");

      setRoomForm(emptyRoomForm);
      setShowAddRoomForm(false);

      await loadData();
    } catch (err) {
      window.alert(err.message || "Failed to add room.");
    } finally {
      setSaving(false);
    }
  };
  const handleExport = () => {
    const headers = ["Room", "Block", "Capacity", "Occupied", "Type", "Rent", "Status"];
    const rows = filteredRooms.map((r) => [
      r.roomNumber || "",
      r.block || "",
      r.capacity ?? 0,
      r.occupied ?? 0,
      r.type || "",
      r.rent ?? 0,
      r.status || "",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hostel-rooms.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Hostel Management</div>
          <div className="ad-page-sub">{loading ? "Loading..." : pageSubtitle}</div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export
          </button>
          <button
            type="button"
            className="ad-btn-outline"
            onClick={() => setShowAddRoomForm((prev) => !prev)}
          >
            {IC.Plus} Add Room
          </button>
          <button
            type="button"
            className="ad-btn-primary"
            onClick={() => setShowAllotForm((prev) => !prev)}
          >
            {IC.Plus} Allot Room
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading hostel...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Hostel}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.occupiedRooms}</div>
              <div className="ad-kpi-label">Occupied rooms</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Check}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.vacantRooms}</div>
              <div className="ad-kpi-label">Vacant rooms</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Mail}</div>
                {kpiStats.openComplaints > 0 && <span className="pill pill-red">Open</span>}
              </div>
              <div className="ad-kpi-val">{kpiStats.openComplaints}</div>
              <div className="ad-kpi-label">Open complaints</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Fees}</div>
              </div>
              <div className="ad-kpi-val">{formatCompact(kpiStats.hostelFees)}</div>
              <div className="ad-kpi-label">Hostel fee collected</div>
            </div>
          </div>
          {showAddRoomForm && (
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Add Hostel Room</span>
                <span
                  className="ad-card-link"
                  onClick={() => setShowAddRoomForm(false)}
                >
                  Cancel
                </span>
              </div>

              <div className="ad-table-filters">

                <input
                  className="ad-input"
                  placeholder="Room Number"
                  value={roomForm.roomNumber}
                  onChange={(e) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      roomNumber: e.target.value.toUpperCase(),
                    }))
                  }
                />

                <input
                  className="ad-input"
                  placeholder="Block"
                  value={roomForm.block}
                  onChange={(e) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      block: e.target.value.toUpperCase(),
                    }))
                  }
                />

                <input
                  className="ad-input"
                  type="number"
                  placeholder="Capacity"
                  value={roomForm.capacity}
                  onChange={(e) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      capacity: Number(e.target.value),
                    }))
                  }
                />

                <select
                  className="ad-select"
                  value={roomForm.type}
                  onChange={(e) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                >
                  <option>Shared</option>
                  <option>Single</option>
                </select>

                <input
                  className="ad-input"
                  type="number"
                  placeholder="Rent"
                  value={roomForm.rent}
                  onChange={(e) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      rent: Number(e.target.value),
                    }))
                  }
                />

                <select
                  className="ad-select"
                  value={roomForm.status}
                  onChange={(e) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option>Available</option>
                  <option>Maintenance</option>
                </select>

              </div>

              <div className="quick-actions">
                <button
                  type="button"
                  className="ad-btn-primary"
                  onClick={handleSaveRoom}
                >
                  {IC.Check} Save Room
                </button>
              </div>
            </div>
          )}
          {showAllotForm && (
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Allot room</span>
                <span className="ad-card-link" onClick={() => setShowAllotForm(false)}>
                  Cancel
                </span>
              </div>

              <div className="ad-table-filters">
                <select
                  className="ad-select"
                  value={allotForm.roomId}
                  onChange={(e) => setAllotForm((prev) => ({ ...prev, roomId: e.target.value }))}
                >
                  <option value="">Select room</option>
                  {rooms
                    .filter((r) => (r.occupied || 0) < (r.capacity || 1) && r.status !== "Maintenance")
                    .map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.roomNumber} — Block {r.block || "—"} ({r.occupied || 0}/{r.capacity || 0})
                      </option>
                    ))}
                </select>

                <select
                  className="ad-select"
                  value={allotForm.studentId}
                  onChange={(e) => setAllotForm((prev) => ({ ...prev, studentId: e.target.value }))}
                >
                  <option value="">Select student</option>
                  {(Array.isArray(students) ? students : []).map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.fullName || `${s.firstName} ${s.lastName}`} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="quick-actions">
                <button
                  type="button"
                  className="ad-btn-primary"
                  onClick={handleAllotRoom}
                  disabled={saving}
                >
                  {IC.Check} Confirm allotment
                </button>
              </div>
            </div>
          )}

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">
                  Room map{blockFilter !== "All" ? ` — Block ${blockFilter}` : ""}
                </span>
                <select
                  className="ad-select"
                  value={blockFilter}
                  onChange={(e) => setBlockFilter(e.target.value)}
                >
                  <option value="All">All blocks</option>
                  {blockOptions.map((block) => (
                    <option key={block} value={block}>
                      Block {block}
                    </option>
                  ))}
                </select>
              </div>

              {mapRooms.length === 0 ? (
                <div className="ad-page-sub">No rooms found.</div>
              ) : (
                <>
                  <div className="room-grid">
                    {mapRooms.map((room) => (
                      <div key={room._id} className={`room-cell ${getRoomCellClass(room)}`}>
                        {room.roomNumber}
                        <br />
                        <span className="activity-time">{getRoomCellLabel(room)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="quick-actions">
                    <span className="room-cell room-occ">Full</span>
                    <span className="room-cell room-free">Vacant</span>
                    <span className="room-cell room-part">Partial</span>
                    <span className="room-cell room-main">Maint.</span>
                  </div>
                </>
              )}
            </div>

            <div>
              <div className="ad-card">
                <div className="ad-card-header">
                  <span className="ad-card-title">Recent complaints</span>
                  <span className="ad-card-link">View all</span>
                </div>

                {hostelComplaints.length === 0 ? (
                  <div className="ad-page-sub">No hostel complaints found.</div>
                ) : (
                  hostelComplaints.map((c) => (
                    <div className="notice-item" key={c._id}>
                      <span className={`pill ${grievancePillClass(c.status)}`}>
                        {c.status?.[0] || "?"}
                      </span>
                      <div>
                        <div className="notice-text">{c.description}</div>
                        <div className="notice-time">
                          {c.category || "Grievance"} ·{" "}
                          {(c.filedDate || c.createdAt)
                            ? new Date(c.filedDate || c.createdAt).toLocaleDateString("en-IN")
                            : ""}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="ad-card">
                <div className="ad-card-header">
                  <span className="ad-card-title">Current allotments</span>
                </div>

                {allotments.length === 0 ? (
                  <div className="ad-page-sub">No students allotted yet.</div>
                ) : (
                  <table className="ad-table">
                    <thead>
                      <tr>
                        <th>Room</th>
                        <th>Student</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allotments.flatMap((room) =>
                        (room.assignedStudents || []).map((student) => {
                          const sid = String(student?._id || student);
                          const name =
                            student?.firstName
                              ? `${student.firstName} ${student.lastName || ""}`.trim()
                              : student?.rollNumber || "Student";
                          return (
                            <tr key={`${room._id}-${sid}`}>
                              <td>{room.roomNumber}</td>
                              <td>{name}</td>
                              <td>
                                <button
                                  type="button"
                                  className="ad-btn-danger"
                                  onClick={() => handleVacate(room, sid)}
                                >
                                  Vacate
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">All rooms</span>
              <div className="ad-search-input">
                {IC.Search}
                <input
                  placeholder="Search room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Block</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Type</th>
                  <th>Rent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan="7">No rooms found.</td>
                  </tr>
                ) : (
                  filteredRooms.map((r) => (
                    <tr key={r._id}>
                      <td>{r.roomNumber}</td>
                      <td>
                        <span className="pill pill-blue">{r.block || "—"}</span>
                      </td>
                      <td>{r.capacity ?? "—"}</td>
                      <td>{r.occupied ?? 0}</td>
                      <td>{r.type || "—"}</td>
                      <td>₹{formatCurrency(r.rent)}</td>
                      <td>
                        <span className={`pill ${statusPillClass(r.status)}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default HostelPage;
