import React, { useState } from "react";
import { httpCall, cernerAPI, getClientCredientials } from "../../middleware/axios-utils";


import { useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
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
const Vitals = ({ patientId }) => {
  const classes = useStyles();
  const [observations, setObservations] = useState([])
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [loader, setLoader] = useState(false);
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
        if (error.response.status === 401) {
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
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
          </Table>
        </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={observations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </>
      }
    </div>
  );
};
export default React.memo(Vitals);
