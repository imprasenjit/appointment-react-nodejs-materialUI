import React, { useState } from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import { httpCall, cernerAPI, getClientCredientials } from "../../middleware/axios-utils";
import { allergiesAPI } from "../../config";

import LinearProgress from "@material-ui/core/LinearProgress";
// import moment from "moment";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const AllergiesDesplay = ({ patientId }) => {
  const classes = useStyles();
  const [allergies, setAllergies] = useState([])
  const [loader, setLoader] = useState(false);

  // console.log("patientId"+patientInfo?.id)
  const searchAllergies = async () => {
    setLoader(true);
    const reqConfig = {
      url: allergiesAPI,
      method: "post",
      data: { patientid: patientId }
    };
    await httpCall(reqConfig)
      .then((res) => {
        console.log("resData", res.data);
        let obArray = res.data.entry;
        obArray.pop();
        setAllergies(obArray);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          getClientCredientials();
          searchAllergies();
        } else {
          console.log(error);
          setLoader(false);
          // history.push("/");
        }
        // setShowLoader(false);
      });
  };

  useEffect(() => {
    searchAllergies();
  }, []);
  if (loader) {
    return (<div className={classes.div}><LinearProgress /></div>);
  }
  console.log(allergies)
  return (
    <div>
      {allergies.length === 0 &&
        <div className="text-center">No Allergies found</div>
      }
      {allergies.length > 0 &&
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>(#)</TableCell>
                <TableCell align="left">Allergy Intolerance</TableCell>
                <TableCell align="left">Recorded Date</TableCell>
                <TableCell align="left">Clinica lStatus</TableCell>
                {/* <TableCell align="right">Participant</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {allergies !== undefined && allergies.map((row, key) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {key + 1}
                  </TableCell>
                  <TableCell align="left">
                    {row.resource.code.text}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.resource?.recordedDate ? moment(row.resource?.recordedDate).format("LL") : 'N/A'}
                  </TableCell>
                  <TableCell align="left">
                    {row.resource.clinicalStatus?.coding[0]?.display}
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
export default AllergiesDesplay;
