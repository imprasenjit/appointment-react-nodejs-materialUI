import { Link as RouterLink } from 'react-router-dom';
import React, { Component, useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import SnackBar from "@material-ui/core/Snackbar";
import Card from "@material-ui/core/Card";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import axios from "axios";
import { API } from '../config';
import Page from '../components/Page';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import AuthLayout from '../layouts/AuthLayout';
import { Link, Container } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
//import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import USERLIST from '../_mocks_/user';
import moment from "moment";
import DatePicker from '@mui/lab/DatePicker';
import frLocale from "date-fns/locale/fr";
import Alert from '@mui/material/Alert';

const useStyles = makeStyles((theme) => ({
    icon: {
        borderRadius: '50%',
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    },
}));
const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));
const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2)
}));
const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 780,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
}));
// ----------------------------------------------------------------------
const CreateAppointment = () => {
    const classes = useStyles();
    const [smallScreen, setSmallScreen] = useState(window.innerWidth < 768);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [schedule, setSchedule] = useState([]);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [confirmationSnackbarOpen, setConfirmationSnackbarOpen] = useState(false);
    const [appointmentDateSelected, setAppointmentDateSelected] = useState(false);
    const [appointmentMeridiem, setAppointmentMeridiem] = useState(0);
    const [validEmail, setValidEmail] = useState(true);
    const [validPhone, setValidPhone] = useState(true);
    const [finished, setFinished] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [showSlots, setShowSlots] = useState(false);
    const [appointmentSlot, setAppointmentSlot] = useState(0);
    const [contactFormFilled, setContactFormFilled] = useState(false);
    const [processed, setProcessed] = useState();
    const [isLoading, setIsLoading] = useState();
    const [confirmationTextVisible, setConfirmationTextVisible] = useState(false);
    const [confirmationSnackbarMessage, setConfirmationSnackbarMessage] = useState();
    const [doctor, setDoctor] = useState('');
    const [doctors, setDoctors] = useState('');
    const [value, setValue] = useState(null);

    const [slots, setSlots] = useState();
    const handleDoctorChange = (event) => {
        setDoctor(event.target.value);
    };

    const fetchDoctors = () => {
        axios.get(API + `/doctors`).then((response) => {
            console.log("response via db: ", response.data);
            setDoctors(response.data);
            // handleDoctorsReponse(response.data);
        });
    }
    useEffect(() => {
        fetchDoctors();
    }, []);
    const handleDateChange = (date) => {
        setAppointmentDate(date);
        setValue(date);
        const data = {
            appointmentDate: date,
            doctor: doctor
        };
        axios.post(API + `/getAvailableSlots`, data).then((response) => {
            console.log("response via db: ", response.data);
            setSlots(response.data);
            setShowSlots(true);
            // handleDoctorsReponse(response.data);
        });
    }
    const handleSetAppointmentSlot = (event) => {
        // console.log(event.target.value);
        setAppointmentSlot(event.target.value)
    }
    const handleSetAppointmentMeridiem = (meridiem) => {
        setAppointmentMeridiem(meridiem);
    }
    const handleSubmit = () => {
        setConfirmationModalOpen(false);
        const newAppointment = {
            name: firstName + " " + lastName,
            email: email,
            phone: phone,
            doctor: doctor,
            // status: 'active',
            slot_date: moment(appointmentDate).format("YYYY-MM-DD"),
            slot_time: appointmentSlot,
        };
        axios
            .post(API + "/appointmentCreate", newAppointment)
            .then((response) => {
                setProcessed(true);
                setStepIndex(stepIndex + 1);
                setConfirmationSnackbarMessage("Appointment succesfully added!");
                setConfirmationSnackbarOpen(true);
            })
            .catch((err) => {
                console.log(err);
                setConfirmationSnackbarMessage("Appointment failed to save.");
                setConfirmationSnackbarOpen(true);
            });
    }
    const handleNext = () => {
        setStepIndex(stepIndex + 1);
        setFinished(stepIndex >= 2);
        if (stepIndex === 1) {
            setShowSlots(false);
        }
    };
    const handlePrev = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
        if (stepIndex === 1) {
            setShowSlots(false);
        }

    };
    const validateEmail = (email) => {
        const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // console.log(email);
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)) {
            setEmail(email);
            setValidEmail(true);
        } else {
            setValidEmail(false)
        }
    }
    const validatePhone = (phoneNumber) => {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (regex.test(phoneNumber)) {
            setPhone(phoneNumber);
            setValidPhone(true);
        } else {
            setValidPhone(false);
        }
    }
    const checkDisableDate = (day) => {
        const dateString = moment(day).format("YYYY-DD-MM");
        return (
            schedule[dateString] === true ||
            moment(day).startOf("day").diff(moment().startOf("day")) < 0
        );
    }

    const renderAppointmentConfirmation = () => {
        if (firstName !== "" && lastName != "" && validPhone && validEmail) {
            const spanStyle = { color: "#2d9df0" };
            return (
                <section>
                    <p>
                        Name:{" "}
                        <span style={spanStyle}>
                            {firstName} {lastName}
                        </span>
                    </p>
                    <p>
                        Number: <span style={spanStyle}>{phone}</span>
                    </p>
                    <p>
                        Email: <span style={spanStyle}>{email}</span>
                    </p>
                    <p>
                        Appointment:{" "}
                        <span style={spanStyle}>
                            {moment(appointmentDate).format(
                                "dddd[,] MMMM Do[,] YYYY"
                            )}
                        </span>{" "}
                        at{" "}
                        <span style={spanStyle}>
                            {appointmentSlot}
                        </span>
                    </p>
                </section>
            );
        } else {
            return (
                <Alert severity="error">Please fill all the required informations.</Alert>
            )
        }

    }
    const renderAppointmentTimes = () => {
        console.log("Slots", slots);
        if (!isLoading) {
            return slots.map((slot) => {
                return (
                    // <FormControlLabel value={slot.toString()} control={<Radio />} label={time1.format("h:mm a") + " - " + time2.format("h:mm a")} />
                    <FormControlLabel
                        key={slot._id}
                        value={`${slot.start_time}-${slot.end_time}`}
                        disabled={slot.status === 'available' ? false : true}
                        control={<Radio />}
                        label={moment(slot.start_time, "hh").format("LT") + " - " + moment(slot.end_time, "hh").format("LT")}
                    />
                );
            });
        } else {
            return null;
        }
    }
    const DatePickerExampleSimple = () => (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
            <DatePicker
                label="Select Date"
                mask="__/__/____"
                value={appointmentDate}
                onChange={(newValue) => {
                    handleDateChange(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );

    const renderStepActions = (step) => {
        return (
            <div style={{ margin: "12px 0" }}>
                {stepIndex !== 2 && <Button
                    variant="contained" color="primary"
                    onClick={handleNext}
                    style={{ marginRight: 12, backgroundColor: "#2d9df0" }}
                >Next</Button>}
                {stepIndex === 2 && <Button
                    variant="contained" color="primary"
                    onClick={() => setConfirmationModalOpen(!confirmationModalOpen)}
                    style={{ marginRight: 12, backgroundColor: "#2d9df0" }}
                >Schedule Appointment</Button>}
                {step > 0 && (
                    <Button
                        disabled={stepIndex === 0}
                        variant="outlined"
                        onClick={handlePrev}
                    >Back</Button>
                )}
            </div>
        );
    }
    const vertical = 'top';
    const horizontal = 'center';
    return (

        <RootStyle title="Create Appointment">
            <AuthLayout>
                Already have an account? &nbsp;
                <Link underline="none" variant="subtitle2" component={RouterLink} to="/">
                    Login
                </Link>
            </AuthLayout>
            <Container>
                <ContentStyle>
                    <div>
                        <section
                            style={{
                                maxWidth: !smallScreen ? "80%" : "100%",
                                margin: "auto",
                                marginTop: !smallScreen ? 20 : 0,
                            }}>
                            <Card
                                style={{
                                    padding: "12px 12px 25px 12px",
                                    height: smallScreen ? "100vh" : null,
                                }}>
                                <Stepper
                                    activeStep={stepIndex}
                                    orientation='vertical'
                                    linear={false}>
                                    <Step>
                                        <StepLabel>Choose Doctor</StepLabel>
                                        <StepContent>
                                            <InputLabel id="demo-simple-select-label">Select Doctor</InputLabel>
                                            <Select
                                                className={classes.formControl}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={doctor}
                                                onChange={handleDoctorChange}
                                            >
                                                {doctors && doctors.map((item) =>
                                                    <MenuItem value={item._id}>{item.name}</MenuItem>
                                                )
                                                }

                                            </Select>{renderStepActions(0)}</StepContent>
                                    </Step>
                                    <Step disabled={!appointmentDate}>
                                        <StepLabel>
                                            Choose an available Date and time time for your appointment
                                        </StepLabel>
                                        <StepContent>
                                            {DatePickerExampleSimple()}
                                            {
                                                showSlots &&
                                                <RadioGroup
                                                    style={{
                                                        marginTop: 15,
                                                        marginLeft: 15,
                                                    }}
                                                    value={appointmentSlot.toString()}
                                                    onChange={handleSetAppointmentSlot}>
                                                    {renderAppointmentTimes()}
                                                </RadioGroup>
                                            }
                                            {renderStepActions(1)}
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>
                                            Share your contact information with us and we'll send you a
                                            reminder
                                        </StepLabel>
                                        <StepContent>
                                            <section>
                                                <form className={classes.root} noValidate autoComplete="off">
                                                    <div>
                                                        <TextField
                                                            name='first_name'
                                                            label='First Name'
                                                            variant="standard"
                                                            onChange={(evt) => setFirstName(evt.target.value)
                                                            }
                                                        />
                                                        <TextField
                                                            name='last_name'
                                                            label='Last Name'
                                                            variant="standard"
                                                            onChange={(evt) => setLastName(evt.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <br />
                                                    <div>
                                                        <TextField
                                                            name='email'
                                                            label='Email'
                                                            variant="standard"
                                                            error={!validEmail}
                                                            helperText={
                                                                validEmail ? null : "Enter a valid email address"
                                                            }
                                                            onChange={(evt) =>
                                                                validateEmail(evt.target.value)
                                                            }
                                                        />
                                                        <TextField
                                                            name='phone'
                                                            variant="standard"
                                                            label='Phone'
                                                            error={!validPhone}
                                                            helperText={
                                                                validPhone ? null : "Enter a valid phone number"
                                                            }
                                                            onChange={(evt) =>
                                                                validatePhone(evt.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </form>
                                            </section>
                                            {renderStepActions(2)}
                                        </StepContent>
                                    </Step>
                                </Stepper>
                            </Card>
                            <Dialog
                                open={confirmationModalOpen}
                                onClose={() => setConfirmationModalOpen(false)}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">Confirm your appointment.</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {renderAppointmentConfirmation()}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setConfirmationModalOpen(false)} color="primary">
                                        Close
                                    </Button>
                                    <Button onClick={() => handleSubmit()} varient="outlined" color="primary" autoFocus>
                                        Submit
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            {/*                             
                            <Dialog
                                modal={true}
                                open={confirmationModalOpen}
                                actions={modalActions}
                                title='Confirm your appointment'>
                                {renderAppointmentConfirmation()}
                            </Dialog> */}
                            <SnackBar
                                anchorOrigin={{ vertical, horizontal }}
                                open={confirmationSnackbarOpen || isLoading}
                                message={
                                    isLoading ? "Loading... " : confirmationSnackbarMessage || ""
                                }
                                autoHideDuration={10000}

                            />
                        </section>
                    </div>
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
export default CreateAppointment;