import React, { useState, useEffect } from "react";
import { httpCall, cernerAPI, getClientCredientials } from "../../middleware/axios-utils";
import { makeStyles } from "@material-ui/styles";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import LinearProgress from "@material-ui/core/LinearProgress";
import TableHead from '@mui/material/TableHead';
import moment from "moment";
import { observationAPI } from "../../config";

// import moment from "moment";
const useStyles = makeStyles({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  div: {
    width: '100%'
  }
});
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
const Vitals = ({ patientId }) => {
  const classes = useStyles();
  const [observations, setObservations] = useState([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - observations.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const searchObservations = async () => {
    setLoader(true);
    // const url = `${cernerAPI}/Observation?category=vital-signs&patient=${patientId}`;
    const reqConfig = {
      url: observationAPI,
      method: "post",
      data: { patientid: patientId, category: 'vital-signs' }
    };
    await httpCall(reqConfig)
      .then((res) => {
        console.log("resData", res.data);
        let obArray = res.data.entry;
        obArray.pop();
        setObservations(obArray);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          getClientCredientials();
          searchObservations();
        } else {
          console.log(error);
          setLoader(false);
          // history.push("/");
        }
        // setShowLoader(false);
      });

  }
  useEffect(() => {
    if (observations.length === 0) {
      searchObservations();
    }
  }, [observations]);
  if (loader) {
    return (<div className={classes.div}><LinearProgress /></div>);
  }
  console.log(observations)
  return (
    <div className={classes.div}>
      {observations.length === 0 &&
        <div className="text-center">No Observations found</div>
      }
      {observations.length > 0 &&
        <><TableContainer component={Paper}>
          <Table className={classes.table} aria-label="enhanced table">
            <TableHead>
              <TableRow>
                <TableCell>(#)</TableCell>
                <TableCell align="left">Observation</TableCell>
                <TableCell align="left">Value</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Performer</TableCell>
                <TableCell align="left">Status</TableCell>
                {/* <TableCell align="right">Participant</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                observations !== undefined && observations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      {(page * rowsPerPage) + (key + 1)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.resource.code?.text}
                    </TableCell>
                    <TableCell align="left">
                      {row.resource.code.coding[0].code == 5 ? row.resource?.component[0]?.valueQuantity?.value : ''} {row.resource.code.coding[0].code == 5 ? row.resource?.component[0]?.valueQuantity?.unit : ''}
                      {row.resource.code.coding[0].code == 5 ? row.resource?.component[1]?.valueQuantity?.value : ''}{row.resource.code.coding[0].code == 5 ? row.resource?.component[0]?.valueQuantity?.unit : ''}

                      {row.resource.valueQuantity?.value}{row.resource.valueQuantity?.unit}
                    </TableCell>
                    <TableCell align="left">
                      {moment(row.resource.issued).format("LL")}
                    </TableCell>
                    <TableCell align="left">
                      {row.resource.performer[0].display}
                    </TableCell>
                    <TableCell align="left">
                      {row.resource.status}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={observations.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        </>
      }
    </div>
  );
};
export default React.memo(Vitals);
