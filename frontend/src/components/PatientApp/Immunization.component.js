import { useState } from "react";
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
import { httpCall, getClientCredientials } from "../../middleware/axios-utils";
import { immunizationsAPI } from "../../config";

import LinearProgress from "@material-ui/core/LinearProgress";
// import moment from "moment";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const ImmunizationDesplay = ({ patientId }) => {
  const classes = useStyles();
  const [immunization, setImmunization] = useState([]);
  const [loader, setLoader] = useState(false);

  // console.log("patientId"+patientInfo?.id)
  const searchImmunization = async () => {
    setLoader(true);
    // const url = `${cernerAPI}/Immunization?patient=${patientId}`;
    const reqConfig = {
      url: immunizationsAPI,
      method: "post",
      data: { patientid: patientId }
    };
    await httpCall(reqConfig)
      .then((res) => {
        console.log("resData", res.data);
        let obArray = res.data.entry;
        obArray.pop();
        setImmunization(obArray.slice(0, 30));
        setLoader(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          getClientCredientials();
          searchImmunization();
        } else {
          console.log(error);
          setLoader(false);
          // history.push("/");
        }
        // setShowLoader(false);
      });
  };

  useEffect(() => {
    searchImmunization();
  }, []);
  if (loader) {
    return (
      <div className={classes.div}>
        <LinearProgress />
      </div>
    );
  }
  console.log(immunization);
  return (
    <div>
      {immunization.length === 0 && (
        <div className='text-center'>No Immunization found</div>
      )}
      {immunization.length > 0 && (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>(#)</TableCell>
                <TableCell align='left'>Vaccine Code</TableCell>
                <TableCell align='left'>Route</TableCell>
                <TableCell align='left'>Site</TableCell>
                <TableCell align='left'>Date</TableCell>
                <TableCell align='left'>Status</TableCell>
                {/* <TableCell align="right">Participant</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {immunization !== undefined &&
                immunization.map((row, key) => (
                  <TableRow key={key}>
                    <TableCell component='th' scope='row'>
                      {key + 1}
                    </TableCell>
                    <TableCell align='left'>
                      {row.resource.vaccineCode?.text}
                    </TableCell>
                    <TableCell align='left'>
                      {row.resource.route?.text}
                    </TableCell>
                    <TableCell align='left'>
                      {row.resource.site?.text}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row.resource?.occurrenceDateTime
                        ? moment(row.resource?.occurrenceDateTime).format("LL")
                        : "N/A"}
                    </TableCell>
                    <TableCell align='left'>{row.resource?.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
export default ImmunizationDesplay;
