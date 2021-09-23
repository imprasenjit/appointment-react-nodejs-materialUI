import { useState } from "react";
import { httpCall, cernerAPI, getClientCredientials } from "../../middleware/axios-utils";
import { medicationAPI } from "../../config";

import { useEffect } from "react";
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
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const MedicationsDesplay = ({ patientId }) => {
  const classes = useStyles();
  const [medications, setMedications] = useState([]);
  const [loader, setLoader] = useState(false);
  // console.log("patientId"+patientInfo?.id)
  const searchMedications = async () => {
    setLoader(true);
    const reqConfig = {
      url: medicationAPI,
      method: "post",
      data: { patientid: patientId }

    };
    await httpCall(reqConfig)
      .then((res) => {
        console.log("resData", res.data);
        let obArray = res.data.entry;
        obArray.pop();
        setMedications(obArray);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          getClientCredientials();
          searchMedications();
        } else {
          console.log(error);
          setLoader(false);
          // history.push("/");
        }
        // setShowLoader(false);
      });
  };
  useEffect(() => {
    searchMedications();
  }, []);
  if (loader) {
    return <LinearProgress />;
  }
  return (
    <div>
      {medications.length === 0 && (
        <div className='text-center'>No Medications found</div>
      )}
      {medications.length > 0 && (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>(#)</TableCell>
                <TableCell align='left'>Medication</TableCell>
                <TableCell align='left'>Authored On</TableCell>
                <TableCell align='left'>Dosage</TableCell>
                <TableCell align='left'>Status</TableCell>
                {/* <TableCell align="right">Participant</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {medications !== undefined &&
                medications.map((row, key) => (
                  <TableRow key={key}>
                    <TableCell component='th' scope='row'>
                      {key + 1}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row.resource.medicationCodeableConcept.text}
                    </TableCell>
                    <TableCell align='left'>
                      {moment(row.resource.authoredOn).format("LL")}
                    </TableCell>
                    <TableCell align='left'>
                      {row.resource.dosageInstruction[0].text}
                    </TableCell>
                    <TableCell align='left'>{row.resource.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
export default MedicationsDesplay;
