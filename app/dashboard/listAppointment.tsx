import React, { useEffect, useState } from 'react';
import { List, Typography, Card, CardContent, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useAppointments } from '../hooks/useAppointments';
import { Appointment } from '../types/Appointment';
import { he } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

const ListAppointment = ({type, appointments, setAppointments}: {type: string, appointments: Appointment[], setAppointments: (appointments: Appointment[]) => void}) => {
const { deleteAppointment } = useAppointments();
const [openDialog, setOpenDialog] = useState(false);
const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const handleDeleteClick = (appointmentId: string) => {
        setSelectedAppointmentId(appointmentId);
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedAppointmentId) {
            deleteAppointment(selectedAppointmentId)
                .then(() => {
                    setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment._id !== selectedAppointmentId));
                    setOpenDialog(false);
                })
                .catch(error => {
                    alert('שגיאה בביטול התור, אנא נסה שנית מאוחר יותר');
                });
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAppointmentId(null);
    };

    const formatDate = (date: string, timeZone: string) => {
        const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let formattedDate = formatInTimeZone(new Date(date), currentTimeZone, 'dd MMMM yyyy בשעה HH:mm', { locale: he })
        // if the time zone is different from the current time zone, add the time zone to the formatted date
        if(currentTimeZone !== timeZone) {
            formattedDate = `${formattedDate} (${formatInTimeZone(new Date(date), timeZone, 'dd MMMM yyyy בשעה HH:mm - zzzz', { locale: he })} - ${timeZone})`
        }

        return formattedDate;
    };

    return (
        <div>
            {appointments.length === 0 && (
                <Typography variant="h4" component="div" gutterBottom textAlign='center'>
                    אין פגישות
                </Typography>
            )}
            <List sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
                {appointments?.map((appointment, index) => (
                    <Card key={index} sx={{ 
                        width: '100%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        '&:hover': {
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease'
                        }
                    }}>
                        <CardContent sx={{ textAlign: 'right' }}>
                            <Box>
                                <Typography variant="h6" component="div" gutterBottom>
                                    {`ד"ר ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`}
                                </Typography>
                                <Typography color="text.secondary">
                                    {`${appointment.clinic?.name}, ${appointment.clinic?.city}`}
                                </Typography>
                                <Typography variant="body2" color="primary" mt={1} dir='rtl'>
                                    {`${formatDate(appointment.date, appointment.clinic?.timeZone)}`}
                                </Typography>
                                {type === 'gt' && (
                                    <Button 
                                        variant="outlined" 
                                        color="error"
                                        sx={{ mt: 2 }}
                                        onClick={() => handleDeleteClick(appointment._id)}
                                    >
                                        ביטול התור
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </List>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" dir="rtl">
                    {"האם אתה בטוח שברצונך לבטל את התור?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" dir="rtl">
                    האם אתה מעוניין להמשיך?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        ביטול
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        אישור
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ListAppointment;