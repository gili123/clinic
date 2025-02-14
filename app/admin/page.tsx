'use client'

import { useState, useEffect } from 'react'
import { TimeZone } from '@/types/common'
import { useDepartment } from '@/app/hooks/useDepartments'
import { useAdmin } from '@/app/hooks/admin'
import { Clinic, Department, Doctor, Schedule } from '../types/admin'

export default function AdminPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoadingClinic, setIsLoadingClinic] = useState(false)
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(false)
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  
  const { getDepartments } = useDepartment()
  const { getDoctors, getClinics, createClinic, createDepartment, createDoctor, createSchedule } = useAdmin()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsData, doctorsData, clinicsData] = await Promise.all([
          getDepartments(),
          getDoctors(),
          getClinics()
        ])

        setDepartments(departmentsData)
        setDoctors(doctorsData)
        setClinics(clinicsData)
      } catch (error) {
        console.error('שגיאה בטעינת הנתונים:', error)
      }
    }

    fetchData()
  }, [])

  const timeZones = [
    { id: 'Asia/Jerusalem', label: 'ישראל' },
    { id: 'America/New_York', label: 'ניו יורק' },
    { id: 'Europe/London', label: 'לונדון' },
  ]

  const daysOfWeek = [
    { value: 0, label: 'ראשון' },
    { value: 1, label: 'שני' },
    { value: 2, label: 'שלישי' },
    { value: 3, label: 'רביעי' },
    { value: 4, label: 'חמישי' },
    { value: 5, label: 'שישי' },
    { value: 6, label: 'שבת' },
  ]

  // יצירת מערך של כל השעות האפשריות
  const timeSlots = Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2)
    const minutes = index % 2 === 0 ? '00' : '30'
    const formattedHour = hour.toString().padStart(2, '0')
    return `${formattedHour}:${minutes}`
  })

  const handleClinicSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoadingClinic(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const newClinic: Clinic = {
      name: formData.get('clinicName') as string,
      city: formData.get('clinicCity') as string,
      timeZone: formData.get('timeZone') as TimeZone,
    }
    
    try {
      const createdClinic = await createClinic(newClinic)
      setClinics([...clinics, createdClinic])
      form.reset()
      alert('המרפאה נוספה בהצלחה!')
    } catch (error) {
      console.error('שגיאה בהוספת המרפאה:', error)
      alert(error.message)
    } finally {
      setIsLoadingClinic(false)
    }
  }

  const handleDepartmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoadingDepartment(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const newDepartment: Department = {
        name: formData.get('departmentName') as string
      }
      
      const createdDepartment = await createDepartment(newDepartment)
      setDepartments([...departments, createdDepartment])
      form.reset()
      alert('המחלקה נוספה בהצלחה!')
    } catch (error) {
      console.error('שגיאה בהוספת המחלקה:', error)
      alert(error.message)
    } finally {
      setIsLoadingDepartment(false)
    }
  }

  const handleDoctorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoadingDoctor(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const selectedSpecialtiesNames = Array.from(formData.getAll('specialties')) as string[]
      const selectedSpecialties = selectedSpecialtiesNames.map(name => {
        const department = departments.find(dept => dept.name === name)
        return department?._id
      }).filter(id => id !== undefined) as string[]
      
      const newDoctor: Doctor = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        specialties: selectedSpecialties
      }
      
      const createdDoctor = await createDoctor(newDoctor)
      setDoctors([...doctors, createdDoctor])
      form.reset()
      alert('הרופא נוסף בהצלחה!')
    } catch (error) {
      console.error('שגיאה בהוספת הרופא:', error)
      alert(error.message)
    } finally {
      setIsLoadingDoctor(false)
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoadingSchedule(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const selectedClinicIndex = Number(formData.get('clinic'))
      const selectedDoctorIndex = Number(formData.get('doctor'))
      
      const newSchedule: Schedule = {
        dayOfWeek: Number(formData.get('dayOfWeek')),
        startTime: formData.get('startTime') as string,
        endTime: formData.get('endTime') as string,
        clinic: clinics[selectedClinicIndex]._id,
        doctor: doctors[selectedDoctorIndex]._id
      }
      
      const createdSchedule = await createSchedule(newSchedule)
      setSchedules([...schedules, createdSchedule])
      form.reset()
      alert('המשמרת נוספה בהצלחה!')
    } catch (error) {
      console.error('שגיאה בהוספת המשמרת:', error)
      alert(error.message)
    } finally {
      setIsLoadingSchedule(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-right">ניהול מערכת</h1>
      
      <div className="space-y-8">
        {/* טופס מרפאה */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-right">הוספת מרפאה חדשה</h2>
          <form onSubmit={handleClinicSubmit} className="space-y-4">
            <div>
              <label className="block text-right mb-1">שם המרפאה</label>
              <input
                type="text"
                name="clinicName"
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-right mb-1">עיר</label>
              <input
                type="text"
                name="clinicCity"
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-right mb-1">אזור זמן</label>
              <select
                name="timeZone"
                required
                className="w-full p-2 border rounded-md"
              >
                {timeZones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoadingClinic}
              className={`w-full py-2 px-4 rounded-md ${
                isLoadingClinic 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isLoadingClinic ? 'מוסיף מרפאה...' : 'הוסף מרפאה'}
            </button>
          </form>
        </div>

        {/* טופס מחלקה */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-right">הוספת מחלקה חדשה</h2>
          <form onSubmit={handleDepartmentSubmit} className="space-y-4">
            <div>
              <label className="block text-right mb-1">שם המחלקה</label>
              <input
                type="text"
                name="departmentName"
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={isLoadingDepartment}
              className={`w-full py-2 px-4 rounded-md ${
                isLoadingDepartment 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isLoadingDepartment ? 'מוסיף מחלקה...' : 'הוסף מחלקה'}
            </button>
          </form>
        </div>

        {/* טופס רופא */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-right">הוספת רופא חדש</h2>
          <form onSubmit={handleDoctorSubmit} className="space-y-4">
            <div>
              <label className="block text-right mb-1">שם פרטי</label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-right mb-1">שם משפחה</label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-right mb-1">התמחויות (ניתן לבחור מספר אפשרויות)</label>
              <select
                name="specialties"
                multiple
                size={4}
                required
                className="w-full p-2 border rounded-md"
              >
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 text-right mt-1">
                * לחץ על Ctrl (או Cmd במק) כדי לבחור מספר התמחויות
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoadingDoctor}
              className={`w-full py-2 px-4 rounded-md ${
                isLoadingDoctor 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isLoadingDoctor ? 'מוסיף רופא...' : 'הוסף רופא'}
            </button>
          </form>
        </div>

        {/* טופס לוח זמנים */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-right">הוספת משמרת חדשה</h2>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div>
              <label className="block text-right mb-1">יום בשבוע</label>
              <select
                name="dayOfWeek"
                required
                className="w-full p-2 border rounded-md"
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-right mb-1">שעת התחלה</label>
              <select
                name="startTime"
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">בחר שעת התחלה</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-right mb-1">שעת סיום</label>
              <select
                name="endTime"
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">בחר שעת סיום</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-right mb-1">מרפאה</label>
              <select
                name="clinic"
                required
                className="w-full p-2 border rounded-md"
              >
                {clinics.map((clinic, index) => (
                  <option key={index} value={index}>
                    {clinic.name} - {clinic.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-right mb-1">רופא</label>
              <select
                name="doctor"
                required
                className="w-full p-2 border rounded-md"
              >
                {doctors.map((doctor, index) => (
                  <option key={index} value={index}>
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoadingSchedule}
              className={`w-full py-2 px-4 rounded-md ${
                isLoadingSchedule 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isLoadingSchedule ? 'מוסיף משמרת...' : 'הוסף משמרת'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
