export interface Operationrequest {
    id: number;
    patientId: string;
    doctorId: string;
    type: string;
    deadlineDate: Date;
    priorityState: string;
}
