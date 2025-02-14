import request from '../network/Request';
import { Appointment } from '@/app/types/Appointment';

export const useAppointments = () => {

    const createAppointment = (appointmentDetails: any) => {
      const payload = {
          doctor: appointmentDetails.doctor?._id,
          clinic: appointmentDetails.clinic?._id,
          date: appointmentDetails.day.format('YYYY-MM-DD'),
          startTime: appointmentDetails.hour.startTime,
          endTime: appointmentDetails.hour.endTime
      }
        return new Promise((resolve, reject) => {
            return request()
            .exec(`appointments`, 'POST', payload)
            .then((response) => response.json())
            .then((responseJson: Appointment) => {
                resolve(responseJson)
            })
            .catch(reject)
        })
    }

  const getAppintments = (filter: string) => {
    return new Promise((resolve, reject) => {
      return request()
          .exec(`appointments?filter=${filter}`, 'GET')
          .then((response) => response.json())
          .then((responseJson: Appointment[]) => {
              resolve(responseJson)
          })
          .catch(reject)
          })
    }

      const getAvailableAppointmentsDays = (departmentId: string, month: string) => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`appointments/available/days?departmentId=${departmentId}&month=${month}`, 'GET')
            .then((response) => response.json())
            .then((responseJson: Appointment[]) => {
                resolve(responseJson)
            })
            .catch(reject)
            })
      }

      const getAvailableDoctors = (departmentId: string, date: string) => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`appointments/available/doctors?departmentId=${departmentId}&date=${date}`, 'GET')
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson)
            })
            .catch(reject)
            })
      }

      const getAvailableAppointments = (departmentId: string, date: Date) => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`appointments/available?departmentId=${departmentId}&date=${date}`, 'GET')
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson)
            })
            .catch(reject)
            })
      }

      const deleteAppointment = (appointmentId: string) => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`appointments/${appointmentId}`, 'DELETE')
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson)
            })
            .catch(reject)
            })
      }

    return {
        createAppointment,
        getAppintments,
        getAvailableAppointmentsDays,
        getAvailableAppointments,
        getAvailableDoctors,
        deleteAppointment
      }
};