import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

const statusPillClass = (status) => {
  if (status === "Available") return "pill-green";
  if (status === "Issued") return "pill-blue";
  if (status === "Reserved") return "pill-amber";
  if (status === "Damaged") return "pill-red";
  return "pill-gray";
};

const emptyForm = () => ({
  title: "",
  author: "",
  category: "",
  isbn: "",
  edition: "",
  publisher: "",
  availableCopies: "1",
  totalCopies: "1",
  rackNo: "",
  status: "Available",
});

/* ════════════════════════════════════════
   PAGE 10 — LIBRARY
════════════════════════════════════════ */
function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/library");
      setBooks(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load library books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const kpiStats = useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    const totalCopies = list.reduce((sum, b) => sum + (b.totalCopies || 0), 0);
    const availableCopies = list.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
    const issuedCopies = totalCopies - availableCopies;
    const needsAttention = list.filter(
      (b) => b.status === "Damaged" || b.status === "Reserved"
    ).length;

    return { totalCopies, availableCopies, issuedCopies, needsAttention };
  }, [books]);

  const filteredBooks = useMemo(() => {
    return (Array.isArray(books) ? books : []).filter((b) => {
      const label = `${b.title || ""} ${b.author || ""} ${b.isbn || ""} ${b.category || ""}`.toLowerCase();
      const matchesSearch = label.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [books, searchTerm, statusFilter]);

  const activeIssues = useMemo(
    () => filteredBooks.filter((b) => b.status === "Issued" || (b.availableCopies || 0) < (b.totalCopies || 0)),
    [filteredBooks]
  );

  const pageSubtitle = useMemo(() => {
    const date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${kpiStats.totalCopies.toLocaleString("en-IN")} total copies · ${date}`;
  }, [kpiStats.totalCopies]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      isbn: book.isbn || "",
      edition: book.edition || "",
      publisher: book.publisher || "",
      availableCopies: String(book.availableCopies ?? 1),
      totalCopies: String(book.totalCopies ?? 1),
      rackNo: book.rackNo || "",
      status: book.status || "Available",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      window.alert("Book title is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author,
        category: form.category,
        isbn: form.isbn,
        edition: form.edition,
        publisher: form.publisher,
        availableCopies: Number(form.availableCopies) || 0,
        totalCopies: Number(form.totalCopies) || 1,
        rackNo: form.rackNo,
        status: form.status,
      };

      if (editingId) {
        await apiFetch(`/library/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/library", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      await loadBooks();

      window.alert(
        editingId
          ? "Book updated successfully"
          : "Book added successfully"
      );
    } catch (e) {
      window.alert(e?.message || "Failed to save book");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book) => {
    const ok = window.confirm(`Delete "${book.title}"?`);
    if (!ok) return;

    try {
      await apiFetch(`/library/${book._id}`, { method: "DELETE" });
      if (editingId === book._id) resetForm();
      await loadBooks();
      window.alert("Book deleted successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to delete book");
    }
  };

  const handleIssueCopy = async (book) => {
    if ((book.availableCopies || 0) <= 0) {
      window.alert("No copies available to issue.");
      return;
    }

    try {
      const availableCopies = (book.availableCopies || 0) - 1;
      await apiFetch(`/library/${book._id}`, {
        method: "PUT",
        body: JSON.stringify({
          availableCopies,
          status: availableCopies === 0 ? "Issued" : book.status === "Available" ? "Issued" : book.status,
        }),
      });
      await loadBooks();
      window.alert("Book issued successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to issue book");
    }
  };

  const handleReturnCopy = async (book) => {
    if ((book.availableCopies || 0) >= (book.totalCopies || 0)) {
      window.alert("All copies are already in library.");
      return;
    }

    try {
      const availableCopies = (book.availableCopies || 0) + 1;
      await apiFetch(`/library/${book._id}`, {
        method: "PUT",
        body: JSON.stringify({
          availableCopies,
          status: availableCopies === book.totalCopies ? "Available" : book.status,
        }),
      });
      await loadBooks();
      window.alert("Book returned successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to return book");
    }
  };

  const handleExport = () => {
    const headers = [
      "Title",
      "Author",
      "Category",
      "ISBN",
      "Available",
      "Total",
      "Rack",
      "Status",
    ];

    const rows = filteredBooks.map((b) => [
      b.title || "",
      b.author || "",
      b.category || "",
      b.isbn || "",
      b.availableCopies ?? 0,
      b.totalCopies ?? 0,
      b.rackNo || "",
      b.status || "",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "library-catalog.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Library Management</div>
          <div className="ad-page-sub">{loading ? "Loading..." : pageSubtitle}</div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export
          </button>
          <button
            type="button"
            className="ad-btn-primary"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm());
              setShowForm(true);
            }}
          >
            {IC.Plus} Add Book
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading library...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Library}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.totalCopies.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">Total copies</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Check}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.availableCopies.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">Available copies</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.History}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.issuedCopies}</div>
              <div className="ad-kpi-label">Copies issued</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.AlertCircle}</div>
                {kpiStats.needsAttention > 0 && <span className="pill pill-amber">Alert</span>}
              </div>
              <div className="ad-kpi-val">{kpiStats.needsAttention}</div>
              <div className="ad-kpi-label">Damaged / reserved</div>
            </div>
          </div>

          {showForm && (
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">{editingId ? "Edit book" : "Add new book"}</span>
                <span className="ad-card-link" onClick={resetForm}>
                  Cancel
                </span>
              </div>

              <div className="ad-table-filters">
                <input
                  className="ad-input"
                  placeholder="Title *"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Author"
                  value={form.author}
                  onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="ISBN"
                  value={form.isbn}
                  onChange={(e) => setForm((prev) => ({ ...prev, isbn: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Edition"
                  value={form.edition}
                  onChange={(e) => setForm((prev) => ({ ...prev, edition: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Publisher"
                  value={form.publisher}
                  onChange={(e) => setForm((prev) => ({ ...prev, publisher: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Available copies"
                  value={form.availableCopies}
                  onChange={(e) => setForm((prev) => ({ ...prev, availableCopies: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Total copies"
                  value={form.totalCopies}
                  onChange={(e) => setForm((prev) => ({ ...prev, totalCopies: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Rack no."
                  value={form.rackNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, rackNo: e.target.value }))}
                />
                <select
                  className="ad-select"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Available">Available</option>
                  <option value="Issued">Issued</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>

              <div className="quick-actions">
                <button type="button" className="ad-btn-primary" onClick={handleSave} disabled={saving}>
                  {IC.Check} {editingId ? "Update book" : "Save book"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">Book catalog</span>
              <div className="ad-table-filters">
                <div className="ad-search-input">
                  {IC.Search}
                  <input
                    placeholder="Search book or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="ad-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All status</option>
                  <option value="Available">Available</option>
                  <option value="Issued">Issued</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Copies</th>
                  <th>Rack</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="7">No books found.</td>
                  </tr>
                ) : (
                  filteredBooks.map((b) => (
                    <tr key={b._id}>
                      <td>{b.title}</td>
                      <td>{b.author || "—"}</td>
                      <td>{b.category || "—"}</td>
                      <td>
                        {b.availableCopies ?? 0}/{b.totalCopies ?? 0}
                      </td>
                      <td>{b.rackNo || "—"}</td>
                      <td>
                        <span className={`pill ${statusPillClass(b.status)}`}>{b.status}</span>
                      </td>
                      <td>
                        <div className="quick-actions">
                          <button
                            type="button"
                            className="ad-btn-outline"
                            onClick={() => handleIssueCopy(b)}
                          >
                            Issue
                          </button>
                          <button
                            type="button"
                            className="ad-btn-success"
                            onClick={() => handleReturnCopy(b)}
                          >
                            Return
                          </button>
                          <button type="button" className="ad-btn-outline" onClick={() => handleEdit(b)}>
                            {IC.Edit}
                          </button>
                          <button type="button" className="ad-btn-danger" onClick={() => handleDelete(b)}>
                            {IC.Trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {activeIssues.length > 0 && (
            <div className="ad-table-wrap">
              <div className="ad-table-header">
                <span className="ad-card-title">Active issues</span>
              </div>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Copies out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeIssues.map((b) => (
                    <tr key={`issue-${b._id}`}>
                      <td>{b.title}</td>
                      <td>{b.author || "—"}</td>
                      <td>{(b.totalCopies || 0) - (b.availableCopies || 0)}</td>
                      <td>
                        <span className={`pill ${statusPillClass(b.status)}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default LibraryPage;
