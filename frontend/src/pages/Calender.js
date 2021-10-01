import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { API } from '../config';
import { httpCall } from '../middleware/axios-utils';
import { makeStyles } from '@material-ui/styles';
// material
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination
} from '@material-ui/core';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { ListHead, ListToolbar, MoreMenu } from '../components/_dashboard/appointments';
//
// import USERLIST from '../_mocks_/user';
import moment from "moment";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        padding: 40
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
export default function Calender() {
    const classes = useStyles();
    const [events, setEvents] = useState([]);
    const colours = ['#fc9403', '#f77f54', '#54e9f7', '#5475f7', '#f754f7', '#f7547d']
    const fetchAppointments = async () => {
        const reqConfig = {
            url: API + '/appointments',
            method: "get",
        };
        await httpCall(reqConfig)
            .then((res) => {
                console.log("resData", res.data);
                const values = res.data.map((appointment) => {
                    const time = appointment.slot_time.split('-');
                    // const a1 = parseInt(time[0]) - 50;
                    // const a2 = parseInt(time[1]) - 500;
                    const date = moment(appointment.appointment_date).format("YYYY-MM-DD");
                    const startTime = date + 'T' + moment(time[0], 'HHmm').subtract({ hours: 5, minutes: 30 }).format('HH:mm:ss+00:00');
                    const endTime = date + 'T' + moment(time[1], 'HHmm').subtract({ hours: 5, minutes: 30 }).format('HH:mm:ss+00:00');
                    console.log("time", time);
                    // console.log("a1", a1);
                    console.log("date", date);
                    console.log("startTime", startTime);
                    console.log("endTime", endTime);
                    const random = Math.floor(Math.random() * colours.length);
                    return { "title": appointment.name, "start": startTime, "end": endTime, "color": colours[random] };
                });
                console.log("events", values);

                setEvents(values);

            })
            .catch((error) => {
                console.log(error);
                // setLoader(false);
            });
    }
    useEffect(() => {
        fetchAppointments();
    }, []);



    return (
        <Page title="Appointments">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Appointments
                    </Typography>

                </Stack>

                <Card className={classes.root}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            start: 'today prev,next',
                            center: 'title',
                            end: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                    />
                    <Scrollbar>

                    </Scrollbar>


                </Card>
            </Container>
        </Page>
    );
}
