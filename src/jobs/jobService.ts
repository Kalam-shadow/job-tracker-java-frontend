import api from '../api/api';
import type { JobApplicationRequest } from './jobdto';

export async function getJobs() {
    const res = await api.get('/jobs');
    return res.data;
}

export async function createJob(jobData: JobApplicationRequest) {
    const res = await api.post('/jobs', jobData);
    return res.data;
}

export async function updateJob(id: number, jobData: JobApplicationRequest) {
    const res = await api.put(`/jobs/${id}`, jobData);
    return res.data;
}

export async function deleteJob(id: number) {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
}