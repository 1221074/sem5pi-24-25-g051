export interface MedicalRecord {
  id: string;
  domainId: string;
  patientId: string;
  allergies: string[];
  medicalConditions: string[];
  freeText: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
