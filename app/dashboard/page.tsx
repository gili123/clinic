'use client'
import React, {useState, useEffect} from 'react';
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NewAppointment from './newAppointment';
import ListAppointment from './listAppointment';
import { useAppointments } from '../hooks/useAppointments';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function Home() {
    const [value, setValue] = useState(1)
    const theme = useTheme()
    const [nextAppointments, setNextAppointments] = useState<any[]>([])
    const [pastAppointments, setPastAppointments] = useState<any[]>([])
    const { getAppintments } = useAppointments()

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = () => {
      getAppintments('gt').then(setNextAppointments)
      getAppintments('lt').then(setPastAppointments)
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

  return (
    <div className='flex flex-col items-center justify-center gap-8 pb-10 mt-16 bg-white opacity-95 mx-16 shadow-md rounded-lg'>
    <Box sx={{ bgcolor: 'background.paper', width: '100%', borderRadius: '8px 8px 0 0' }}>
      <AppBar position="static" sx={{ borderRadius: '8px 8px 0 0' }}>
        <Tabs className='border-b-2 border-gray-300'
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          TabIndicatorProps={{
            style: {
              backgroundColor: "black",
              height: "3px"
            }
          }}
        >
          <Tab label={`פגישות שעברו (${pastAppointments.length})`} dir='rtl' disabled={pastAppointments.length === 0} {...a11yProps(0)} />
          <Tab label="פגישה חדשה" {...a11yProps(1)} />
          <Tab label={`פגישות הבאות (${nextAppointments.length})`} dir='rtl' disabled={nextAppointments.length === 0} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <ListAppointment type='lt' appointments={pastAppointments} setAppointments={setPastAppointments} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
          <NewAppointment onChange={() => {fetchAppointments()}} />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <ListAppointment type='gt' appointments={nextAppointments} setAppointments={setNextAppointments} />
      </TabPanel>
    </Box>
    </div>
  );
}
