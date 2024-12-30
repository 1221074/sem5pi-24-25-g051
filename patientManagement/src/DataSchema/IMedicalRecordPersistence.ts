export interface IMedicalRecordPersistence {
    domainId: string;
    patientId: string;
    allergies: string[];
    medicalConditions: string[];
    freeText: string;
}