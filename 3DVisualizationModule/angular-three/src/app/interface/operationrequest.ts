export interface Operationrequest {
    id: number;
    patientId: string;
    doctorId: string;
    operationTypeId: string;
    deadlineDate: Date;
    priorityState: string;
}
