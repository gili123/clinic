import { TimeZone } from './common'

export interface Clinic {
  name: string
  city: string
  timeZone: TimeZone
}

export interface Department {
  name: string
}

export interface Doctor {
  firstName: string
  lastName: string
  specialties: string[]
}

export interface Schedule {
  dayOfWeek: number
  startTime: string
  endTime: string
  clinic: string
  doctor: string
} 