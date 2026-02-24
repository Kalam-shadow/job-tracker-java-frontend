import { useState } from "react";
import type { JobApplicationRequest } from "./jobdto";

interface JobFormProps {
  onJobCreated: (job: JobApplicationRequest) => void;
}

export default function JobForm({ onJobCreated }: JobFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newJob: JobApplicationRequest = {
      companyName,
      position,
      applicationDate,
      notes,
      status,
    };
    try {
      
      onJobCreated(newJob);
      setCompanyName("");
      setPosition("");
      setApplicationDate("");
      setNotes("");
      setStatus("");
    } catch (err) {
      console.error("Failed to create job:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company Name" />
      <input value={position} onChange={e => setPosition(e.target.value)} placeholder="Position" />
      <input type="date" value={applicationDate} onChange={e => setApplicationDate(e.target.value)} />
      <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
      {/* <input value={status} onChange={e => setStatus(e.target.value)} placeholder="Status" /> */}
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">Select Status</option>
        <option value="APPLIED">APPLIED</option>
        <option value="INTERVIEW">INTERVIEW</option>
        <option value="OFFER">OFFER</option>
        <option value="REJECTED">REJECTED</option>
      </select>
      <button type="submit">Add Job</button>
    </form>
  );
}