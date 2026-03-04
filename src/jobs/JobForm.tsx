import { useState } from "react";
import type { JobApplicationRequest } from "./jobdto";
import "./JobForm.css";

interface JobFormProps {
  onJobCreated: (job: JobApplicationRequest) => void;
  onCancel?: () => void;
}

export default function JobForm({ onJobCreated, onCancel }: JobFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      if (!companyName.trim() || !position.trim() || !applicationDate || !status) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const newJob: JobApplicationRequest = {
        companyName,
        position,
        applicationDate,
        notes,
        status,
      };

      onJobCreated(newJob);
      setSuccess(true);
      
      setTimeout(() => {
        setCompanyName("");
        setPosition("");
        setApplicationDate("");
        setNotes("");
        setStatus("");
        setSuccess(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to create job:", err);
      setError("Failed to create job. Please try again.");
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setCompanyName("");
    setPosition("");
    setApplicationDate("");
    setNotes("");
    setStatus("");
    setError("");
    setSuccess(false);
  }

  return (
    <div className="job-form-container">
      <div className="form-header">
        <h3>Add New Job Application</h3>
        {onCancel && (
          <button className="form-close-btn" onClick={onCancel}>
            ✕
          </button>
        )}
      </div>

      <div className="form-content">
        {error && <div className="form-error">⚠️ {error}</div>}
        {success && <div className="form-success">✓ Job added successfully!</div>}

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="company">
                Company Name <span className="required-indicator">*</span>
              </label>
              <input
                id="company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Google, Microsoft"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">
                Position <span className="required-indicator">*</span>
              </label>
              <input
                id="position"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g., Senior Developer"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="appDate">
                Application Date <span className="required-indicator">*</span>
              </label>
              <input
                id="appDate"
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status <span className="required-indicator">*</span>
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">-- Select Status --</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="form-group form-grid-full">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about the application..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="form-actions button btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Job"}
            </button>
            <button
              type="reset"
              className="form-actions button btn-reset"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}