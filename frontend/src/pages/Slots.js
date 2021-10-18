import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { API } from '../config';
import { httpCall } from '../middleware/axios-utils';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@mui/material/Alert';
// material
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
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
import { ListHead, ListToolbar, SlotsMoreMenu } from '../components/_dashboard/slots';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
//import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import USERLIST from '../_mocks_/user';
import moment from "moment";
import TimePicker from '@mui/lab/TimePicker';

// ----------------------------------------------------------------------
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
const TABLE_HEAD = [
    { id: 'sl_no', label: '(#)', alignRight: false },
    { id: 'start_time', label: 'Start Time', alignRight: false },
    { id: 'end_time', label: 'End Time', alignRight: false },
    { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function Slots() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [slotList, setSlotList] = useState([]);
    const [open, setOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState(0);
    const [doctor, setDoctor] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');
    const [generatedSlots, setGeneratedSlots] = useState([])
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const generateSlots = () => {
        if (startTime === '' || endTime === '' || duration === '') {
            setError(true);
            setErrorText("Please select start time and end time and duration.");
            return false;
        }
        const slots = [];
        let stime = moment(startTime).format('HH:mm');
        const etime = moment(endTime).format('HHmm');
        let gtime = 0;
        let looptime = 0;
        while (etime > looptime) {
            // console.log("stime", stime);
            // console.log("looptime", looptime);
            looptime = moment(stime, "HH:mm").add(duration, 'minutes').format('HHmm');
            gtime = moment(stime, "HHmm").add(duration, 'minutes').format('HH:mm');
            slots.push({ "startTime": moment(stime, "HHmm").format("HH:mm"), "endTime": gtime });
            stime = gtime;
        }
        // console.log(slots);
        setGeneratedSlots(slots);
    }
    const createSlot = async () => {
        setLoading(true);
        const reqConfig = {
            url: API + '/slots',
            method: "post",
            data: {
                startTime: moment(startTime).format('HHmm'),
                endTime: moment(endTime).format('HHmm'),
                duration: duration,
                doctor: doctor
            }
        };
        await httpCall(reqConfig)
            .then((res) => {
                console.log("resData", res.data);
                setLoading(false);
                setOpen(false);
                fetchSlots();
            })
            .catch((error) => {
                setLoading(false);
                setError(true);
                setErrorText("Slots overlapping.")
                console.log(error);
                // setLoader(false);
            });
    }
    const fetchSlots = async (doctor) => {
        const Auth = JSON.parse(localStorage.getItem("Auth"));
        await setDoctor(Auth.user._id);
        const reqConfig = {
            url: API + '/retrieveSlots/' + Auth.user._id,
            method: "get",
        };
        await httpCall(reqConfig)
            .then((res) => {
                // console.log("resData", res.data);
                setSlotList(res.data);
                // setLoader(false);
            })
            .catch((error) => {
                console.log(error);
                // setLoader(false);
            });
    }
    useEffect(async () => {
        fetchSlots();
    }, []);
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = slotList.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const getSlotTime = (item) => {
        const slots = [...Array(8).keys()];
        const times = slots.map((slot) => {

            const time1 = moment().hour(9).minute(0).add(slot, "hours");
            const time2 = moment()
                .hour(9)
                .minute(0)
                .add(slot + 1, "hours");
            return time1.format("h:mm a") + " - " + time2.format("h:mm a");
        });
        // console.log(times);
        return times[item];
    }
    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - slotList.length) : 0;

    const filteredUsers = applySortFilter(slotList, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Page title="Slots">
            <Container>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth={fullWidth}
                    maxWidth={maxWidth}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create New Slot</DialogTitle>
                    <DialogContent>
                        <Stack direction="column" spacing={2}>
                            {loading && <CircularProgress />}
                            {error && <Alert severity="error">{errorText}</Alert>}
                            <DialogContentText>
                                Please Select the slot for appointment.
                            </DialogContentText>


                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                    label="Start Time"
                                    ampm={false}
                                    value={startTime}
                                    onChange={(newValue) => {
                                        // console.log("starttime", moment(newValue).format('LT'));
                                        setStartTime(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <TimePicker
                                    label="End Time"
                                    value={endTime}
                                    ampm={false}
                                    minTime={startTime}
                                    onChange={(newValue) => {
                                        setEndTime(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <TextField id="slot_duration" label="Enter SLot Duration in minutes" onChange={(e) => setDuration(e.target.value)} variant="standard" helperText="E.g 120" />
                            {generatedSlots.length > 0 &&
                                generatedSlots.map((item, key) => (
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox defaultChecked />} label={key + 1 + '. ' + item.startTime + '-' + item.endTime} />
                                    </FormGroup>

                                ))
                            }
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={generateSlots} color="primary">
                            Generate Slots
                        </Button>
                        <Button variant="contained" onClick={createSlot} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Slots
                    </Typography>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to="#"
                        onClick={handleClickOpen}
                        startIcon={<Icon icon={plusFill} />}
                    >
                        New Slot
                    </Button>
                </Stack>

                <Card>
                    <ListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <ListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={slotList.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, key) => {
                                            const { _id, start_time, end_time } = row;
                                            const isItemSelected = selected.indexOf(_id) !== -1;
                                            let slno = page * rowsPerPage + key + 1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleClick(event, _id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        {slno}
                                                    </TableCell>
                                                    <TableCell align="left">{moment(start_time, "hhmm").format("LT")}</TableCell>
                                                    <TableCell align="left">{moment(end_time, "hhmm").format("LT")}</TableCell>
                                                    <TableCell align="right">
                                                        <SlotsMoreMenu fetchSlots={fetchSlots} slot_id={_id} />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30]}
                        component="div"
                        count={slotList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
}
