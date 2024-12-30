export interface IMedicalRecordDTO {
    id: string;
    patientId: string;
    allergies: object[];
    medicalConditions: object[];
    freeText: string
  }
  