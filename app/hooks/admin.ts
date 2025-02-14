import request from '../network/Request';
import { TimeZone } from '@/types/common';
import { Clinic, Department } from '@/types/admin'

interface Clinic {
    name: string
    city: string
    timeZone: TimeZone
}

export const useAdmin = () => {
  
  const getDoctors = () => {
    return new Promise((resolve, reject) => {
        return request()
        .exec(`doctor`, 'GET')
        .then((response) => response.json())
        .then(resolve)
        .catch(reject)
        })
    }

    const createDoctor = (doctor: Doctor) => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`doctor/admin`, 'POST', doctor)
            .then((response) => response.json())
            .then(resolve)
            .catch(reject)
            })
        }

    const getClinics = () => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`clinic/admin`, 'GET')
            .then((response) => response.json())
            .then(resolve)
            .catch(reject)
            })
        }

    const createClinic = (clinic: Clinic) => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`clinic/admin`, 'POST', clinic)
            .then((response) => response.json())
            .then(resolve)
            .catch(reject)
            })
        }

    const createDepartment = (department: Department) => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`department/admin`, 'POST', department)
            .then((response) => response.json())
            .then(resolve)
            .catch(reject)
            })
        }

    const createSchedule = (schedule: Schedule) => {
        return new Promise((resolve, reject) => {
            return request()
            .exec(`schedule/admin`, 'POST', schedule)
            .then((response) => response.json())
            .then(resolve)
            .catch(reject)
            })
        }

    return {
        getDoctors,
        createDoctor,
        getClinics,
        createClinic,
        createDepartment,
        createSchedule
      }
};