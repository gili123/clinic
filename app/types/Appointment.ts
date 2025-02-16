export interface Appointment {
  _id?: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  date: Date;
  startTime: string;
  endTime: string;
},

export type Department = {
  _id: string;
  name: string;
}

export type Doctor = {
  _id: string;
  firstName: string;
  lastName: string;
}