export interface MedicalRecord {
  _id: string;
  patientId: string;
  allergies: object[];
  medicalConditions: object[];
  freeText: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
