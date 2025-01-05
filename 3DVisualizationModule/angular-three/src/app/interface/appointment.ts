export interface Appointment {
  id: string;
  requestID : string;
  roomId: string;
  dateTime	: Date;
  status: number;
  description: string;
  __v: number;
}
