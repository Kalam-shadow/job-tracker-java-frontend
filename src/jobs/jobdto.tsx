export interface JobApplicationRequest {
    companyName: string;
    position: string;
    applicationDate: string; // ISO format date string
    status: string; // Should match JobApplication.Status enum values
    notes: string;
}

export interface JobApplicationResponse extends JobApplicationRequest {
    id: number;
}