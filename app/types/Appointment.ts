export interface Appointment {
  _id?: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  date: Date;
  startTime: string;
  endTime: string;
}