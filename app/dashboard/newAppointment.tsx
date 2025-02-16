'use client'
import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useDepartment } from '../hooks/useDepartments';
import { useAppointments } from '../hooks/useAppointments';
import { Dayjs } from 'dayjs';
import FormControl from '@mui/material/FormControl';
import { Box, Button, IconButton, InputLabel, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { Department, Doctor } from '../types/Appointment';

const DepartmentSelect = ({value, onChange}: {value: string, onChange: (value: string) => void})=> {
    const [departments, setDepartments] = useState<Department[]>([]);
    const { getDepartments } = useDepartment();

    useEffect(() => {
        getDepartments()
            .then(setDepartments)
            .catch(error => {
                alert('שגיאה! אנא נסה שנית מאוחר יותר')
                console.error(error.message);
            });
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        onChange?.(event.target.value);
    };

    const renderDepartments = () => {
        return departments?.map((department) => (
            <MenuItem key={department._id} value={department._id}>{department.name}</MenuItem>
        ));
    };

    if (departments.length === 0) {
        return <div>Loading...</div>
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">בחר מחלקה</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                value={value || ''}
                label="בחר מחלקה"
                onChange={handleChange}
                sx={{ width: 200 }}
            >
                {renderDepartments()}
            </Select>
        </FormControl>
    )
}

const DoctorSelect = ({value, onChange, doctors}: {value: string, onChange: (value: string) => void, doctors: Doctor[]}) => {

    const handleChange = (event: SelectChangeEvent) => {
        onChange?.(event.target.value);
    };

    const renderDoctors = () => {
        return doctors.map((doctor) => (
            <MenuItem key={doctor._id} value={doctor._id}>{doctor.firstName} {doctor.lastName}</MenuItem>
        ));
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">בחר רופא</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                value={value || ''}
                label="בחר רופא"
                onChange={handleChange}
                sx={{ width: 200 }}
            >
                {renderDoctors()}
            </Select>
        </FormControl>
    )
}

const NewAppointment = ({onChange}: {onChange: () => void}) => {
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [department, setDepartment] = useState<Department | null>(null);
    const [availableDays, setAvailableDays] = useState<number[]>([]);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Dayjs | null>(null);
    const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null);
    const [availableAppointments, setAvailableAppointments] = useState<any[]>([]);
    const [availableHours, setAvailableHours] = useState<any[]>([]);
    const [clinic, setClinic] = useState<any | null>(null);
    const [details, setDetails] = useState<any | null>(null);
    const { getAvailableAppointmentsDays, getAvailableAppointments, createAppointment } = useAppointments()

    function generate(element: React.ReactElement<unknown>) {
        return availableHours.map((hour) =>
          React.cloneElement(element, {
            key: hour.startTime,
            onClick: () => handleHourClick(hour),
            children: <ListItemText
                primary={hour.startTime}
                sx={{ cursor: 'pointer' }}
            />,
            sx: { '&:hover': { backgroundColor: '#f0f0f0' } }
          }),
        );
    }

    const handleHourClick = (hour: any) => {
        const appointment = availableAppointments.find((appointment) => appointment.doctor._id === doctor)
        setDetails({
            doctor: appointment?.doctor,
            clinic: appointment?.clinic,
            day: selectedDay,
            hour: hour
        })
        setOpen(true)
    };

    useEffect(() => {
        availableAppointments.map((appointment) => appointment.doctor)
    }, [selectedDay])

    useEffect(() => {
        setSelectedDay(null)
        setAvailableHours([])
    }, [department])

    useEffect(() => {
            getAvailableAppointmentsDays(department || '0', currentMonth?.format('MM') || '0')
            .then(setAvailableDays)
            setAvailableAppointments([])
    }, [department, currentMonth])

    const handleDayChange = (day: Dayjs) => {
        setSelectedDay(day)
        getAvailableAppointments(department || '0', day.format('YYYY-MM-DD'))
        .then(setAvailableAppointments)
        setDoctor(null)
        setAvailableHours([])
    }

    useEffect(() => {
        if (doctor) {
            const appointment = availableAppointments.find((appointment) => appointment.doctor._id === doctor)
            setAvailableHours(appointment?.hours || [])
            setClinic(appointment?.clinic)
        }
    }, [doctor])

    const handleAppointmentConfirm = () => {
        setOpen(false)
        createAppointment(details)
        .then((response) => {
            onChange()
            setSnackbarMessage('הפגישה נוצרה בהצלחה')
        })
        .catch((error) => {
            if(error.msg) {
                setSnackbarMessage(error.msg)
            } else {
                alert('שגיאה ביצירת הפגישה, נסה שנית מאוחר יותר')
            }
        })
    }

    const action = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarMessage('')}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

    return (
        <div className='flex flex-col md:flex-row items-center md:items-start justify-between p-4 md:p-8 gap-4 md:gap-8'>
            <div className='w-full md:flex-1 flex flex-col items-center justify-center'>
                {selectedDay && <>
                    <div className='w-full max-w-[200px] mb-4'>
                        <DoctorSelect 
                            value={doctor} 
                            onChange={setDoctor}
                            doctors={availableAppointments.map((appointment) => appointment.doctor)}
                        />
                    </div>
                    {doctor && <>
                        <p className='text-lg font-semibold mb-4 text-center'>{`${clinic?.name} - ${clinic?.city}`}</p>
                        <p className='text-lm font-semibold mb-4 text-center' dir='rtl'>{`לפי איזור זמן ${clinic?.timeZone}`}</p>
                    </>
                    }
                    <div className='border rounded-lg p-4'>
                        <h3 className='text-lg font-semibold mb-4 text-center'>תורים זמינים</h3>
                        <List dense={false} sx={{ 
                            maxHeight: 300, 
                            width: 150,
                            overflowY: 'scroll', 
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                display: 'block'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888',
                                borderRadius: '4px'
                            }
                        }}>
                            {generate(
                                <ListItem>
                                <ListItemText
                                    primary="Single-line item"
                                    secondary={'Secondary text'}
                                />
                                </ListItem>
                            )}
                        </List>
                    </div>
                </>}
            </div>
            
            <div className='w-full md:flex-1 flex justify-center'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar className='bg-blue-100 rounded-lg'
                        disablePast
                        onChange={handleDayChange}
                        onMonthChange={setCurrentMonth}
                        shouldDisableDate={(date) => {
                            const day = date.day();
                            return !availableDays.includes(day)
                        }}
                    />
                </LocalizationProvider>
            </div>

            <div className='w-full md:flex-1 flex justify-center md:justify-end'>
                <DepartmentSelect value={department} onChange={setDepartment} />
            </div>
            <Modal
                open={open}
                onClose={()=> setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
                        אישור הפגישה
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        מרפאה: {details?.clinic?.name}, {details?.clinic?.city}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                        רופא: {details?.doctor?.firstName} {details?.doctor?.lastName}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                        יום: {selectedDay?.format('DD/MM/YYYY')}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                        שעה: {details?.hour?.startTime}
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" onClick={handleAppointmentConfirm}>
                            אישור
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>
                            ביטול
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar
                open={snackbarMessage !== ''}
                onClose={() => setSnackbarMessage('')}
                message={snackbarMessage}
                action={action}
            />
        </div>
    )
}

export default NewAppointment;
