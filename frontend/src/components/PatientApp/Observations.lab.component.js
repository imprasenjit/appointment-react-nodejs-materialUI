import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import moment from "moment";
import { httpCall, getClientCredientials } from "../../middleware/axios-utils";
import { observationAPI } from "../../config";

// import moment from "moment";
const useStyles = makeStyles({
  table: {

  },
  div: {
    width: '100%'
  }
});
const Lab = ({ patientId }) => {
  const classes = useStyles();
  const [observations, setObservations] = useState([])
  const [loader, setLoader] = useState();
  const searchObservations = async () => {
    setLoader(true);
    // const url = `${cernerAPI}/Observation?category=laboratory&patient=${patientId}`;
    const reqConfig = {
      url: observationAPI,
      method: "post",
      data: { patientid: patientId, category: 'laboratory' }
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
  };

  useEffect(() => {
    if (observations.length === 0) {
      searchObservations();
    }
  }, []);
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
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>(#)</TableCell>
                <TableCell align="left">Observation</TableCell>
                <TableCell align="left">Value</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Status</TableCell>
                {/* <TableCell align="right">Participant</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                observations !== undefined && observations.map((row, key) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      {key + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.resource.code?.text}
                    </TableCell>
                    <TableCell align="left">
                      {row.resource.valueQuantity?.value}{row.resource.valueQuantity?.unit}
                    </TableCell>
                    <TableCell align="left">
                      {moment(row.resource.issued).format("LL")}
                    </TableCell>
                    <TableCell align="left">
                      {row.resource.status}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </div>
  );
};
export default React.memo(Lab);
