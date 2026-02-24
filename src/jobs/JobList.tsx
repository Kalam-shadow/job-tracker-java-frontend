import { useEffect, useState } from "react";
import { getJobs, deleteJob, updateJob, createJob } from "./jobService";
import type { JobApplicationRequest, JobApplicationResponse } from "./jobdto";
import JobForm from "./JobForm";

export default function JobList() {
  const [jobs, setJobs] = useState<JobApplicationResponse[]>([]);

  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editData, setEditData] = useState<JobApplicationRequest | null>(null);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getJobs().then(setJobs).catch(err => console.error("Failed to fetch jobs:", err));
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Failed to delete job:", err);
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
    setEditData({ ...job }); // Initialize editData with the current job data});
  }
  async function handleEdit() {
    if (!editingJobId || !editData) return;
    try {
      await updateJob(editingJobId, editData);
      setJobs(jobs.map((j) => (j.id === editingJobId ? { ...j, ...editData } : j)));
      setEditingJobId(null);
      setEditData(null);
    } catch (err) {
      console.error("Failed to update job:", err);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>Jobs</h2>
      <button onClick={handleAddJob}>Add Job</button>
      </div>
      
      {showForm && (
        <JobForm
          onJobCreated={handleCreateJob}
        />
      )}
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            ({editingJobId === job.id ?
              (
                <>
                  <input
                    type="text"
                    value={editData?.companyName || job.companyName}
                    onChange={(e) => setEditData({ ...editData!, companyName: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editData?.position || job.position}
                    onChange={(e) => setEditData({ ...editData!, position: e.target.value })}
                  />
                  <input
                    type="date"
                    value={editData?.applicationDate || job.applicationDate}
                    onChange={(e) => setEditData({ ...editData!, applicationDate: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editData?.notes || job.notes}
                    onChange={(e) => setEditData({ ...editData!, notes: e.target.value })}
                  />
                  <select
                    value={editData?.status || job.status}
                    onChange={(e) => setEditData({ ...editData!, status: e.target.value })}
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="OFFER">OFFER</option>
                  </select>
                  <button onClick={handleEdit}>Save</button>
                </>
              ) : (
                <>
                  job.id-{job.companyName} - {job.position} - {job.applicationDate} - {job.notes} - {job.status}
                  <button onClick={() => startEdit(job.id, job)}>Edit</button>
                  <button onClick={() => handleDelete(job.id)}>Delete</button>
                </>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}