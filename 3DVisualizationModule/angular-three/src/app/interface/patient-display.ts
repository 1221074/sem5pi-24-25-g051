export interface PatientDisplay {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    birthDate: string;
    sex: string;
    email: string;
    phone: string;
    emergencyContact: string;
    appointmentList: string[];
    allergyList: string[];
}
