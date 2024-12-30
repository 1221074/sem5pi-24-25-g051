export interface IMedicalRecordPersistence {
    domainId: string;
    patientId: string;
    allergies: object[];
    medicalConditions: object[];
    freeText: string;
}