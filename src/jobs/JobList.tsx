import { useEffect, useState } from "react";
import { getJobs, deleteJob, updateJob, createJob } from "./jobService";
import type { JobApplicationRequest, JobApplicationResponse } from "./jobdto";
import JobForm from "./JobForm";
import { logout } from "../auth/authService";
import "./JobList.css";

export default function JobList() {
  const [jobs, setJobs] = useState<JobApplicationResponse[]>([]);

  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editData, setEditData] = useState<JobApplicationRequest | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getJobs().then(setJobs).catch(err => console.error("Failed to fetch jobs:", err));
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this job application?")) {
      return;
    }
    
    setIsDeleting(id);
    try {
      await deleteJob(id);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("Failed to delete job");
    } finally {
      setIsDeleting(null);
    }
  }

  async function handleAddJob() {
    setShowForm(true);
  }

  async function handleCreateJob(job: JobApplicationRequest) {
    try {
      const createdJob = await createJob(job);
      setJobs([...jobs, createdJob]);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create job:", err);
    }
  }

  async function startEdit(id: number, job: JobApplicationResponse) {
    setEditingJobId(id);
    setEditData({ ...job });
  }

  async function handleEdit() {
    if (!editingJobId || !editData) return;
    setIsSaving(true);
    
    try {
      await updateJob(editingJobId, editData);
      setJobs(jobs.map((j) => (j.id === editingJobId ? { ...j, ...editData } : j)));
      setEditingJobId(null);
      setEditData(null);
    } catch (err) {
      console.error("Failed to update job:", err);
      alert("Failed to update job");
    } finally {
      setIsSaving(false);
    }
  }

  function getStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      APPLIED: "status-applied",
      INTERVIEW: "status-interview",
      OFFER: "status-offer",
      REJECTED: "status-rejected",
    };
    return statusMap[status] || "status-applied";
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1 className="jobs-title">My Job Applications</h1>
        <div className="jobs-header-actions">
          <button className="btn-primary" onClick={handleAddJob}>
            ✚ New Application
          </button>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="jobs-form-container">
          <JobForm
            onJobCreated={handleCreateJob}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="jobs-list-container">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No applications yet</h3>
            <p>Start by adding your first job application to track your progress.</p>
            <button className="btn-primary" onClick={handleAddJob}>
              Create Your First Application
            </button>
          </div>
        ) : (
          <ul className="jobs-list">
            {jobs.map((job) => (
              <li key={job.id} className="job-item">
                {editingJobId === job.id ? (
                  <div className="job-item-edit-form">
                    <h3>Edit Application</h3>
                    
                    <div className="form-group">
                      <label htmlFor={`edit-company-${job.id}`}>Company Name</label>
                      <input
                        id={`edit-company-${job.id}`}
                        type="text"
                        value={editData?.companyName || job.companyName}
                        onChange={(e) =>
                          setEditData({
                            ...editData!,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-position-${job.id}`}>Position</label>
                      <input
                        id={`edit-position-${job.id}`}
                        type="text"
                        value={editData?.position || job.position}
                        onChange={(e) =>
                          setEditData({
                            ...editData!,
                            position: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-date-${job.id}`}>Application Date</label>
                      <input
                        id={`edit-date-${job.id}`}
                        type="date"
                        value={editData?.applicationDate || job.applicationDate}
                        onChange={(e) =>
                          setEditData({
                            ...editData!,
                            applicationDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-notes-${job.id}`}>Notes</label>
                      <textarea
                        id={`edit-notes-${job.id}`}
                        value={editData?.notes || job.notes}
                        onChange={(e) =>
                          setEditData({
                            ...editData!,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-status-${job.id}`}>Status</label>
                      <select
                        id={`edit-status-${job.id}`}
                        value={editData?.status || job.status}
                        onChange={(e) =>
                          setEditData({
                            ...editData!,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                    <div className="form-actions">
                      <button
                        className="form-save"
                        onClick={handleEdit}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        className="form-cancel"
                        onClick={() => {
                          setEditingJobId(null);
                          setEditData(null);
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="job-item-view">
                    <div className="job-item-header">
                      <h3 className="job-company">{job.companyName}</h3>
                      <p className="job-position">{job.position}</p>
                      <span
                        className={`job-status-badge ${getStatusBadgeClass(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="job-details">
                      <div className="job-detail-row">
                        <span className="job-detail-label">📅 Applied:</span>
                        <span className="job-detail-value">
                          {formatDate(job.applicationDate)}
                        </span>
                      </div>
                    </div>

                    {job.notes && (
                      <div className="job-notes">
                        <strong>Notes:</strong> {job.notes}
                      </div>
                    )}

                    <div className="job-item-actions">
                      <button
                        className="job-item-edit"
                        onClick={() => startEdit(job.id, job)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="job-item-delete"
                        onClick={() => handleDelete(job.id)}
                        disabled={isDeleting === job.id}
                      >
                        {isDeleting === job.id ? "Deleting..." : "🗑️ Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}