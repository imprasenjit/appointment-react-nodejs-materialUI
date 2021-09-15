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
import { problemsAPI } from "../../config";

import LinearProgress from "@material-ui/core/LinearProgress";

// import moment from "moment";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const ProblemsDesplay = ({ patientId }) => {
  const classes = useStyles();
  const [problems, setProblems] = useState([])
  const [loader, setLoader] = useState(false);

  // console.log("patientId"+patientInfo?.id)
  const searchProblems = async () => {
    setLoader(true);
    const reqConfig = {
      url: problemsAPI,
      method: "post",
      data: { patientid: patientId }
    };
    await httpCall(reqConfig)
      .then((res) => {
        console.log("resData", res.data);
        let obArray = res.data.entry;
        obArray.pop();
        setProblems(obArray.slice(0, 30));
        setLoader(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          getClientCredientials();
          searchProblems();
        } else {
          console.log(error);
          setLoader(false);
        }
        // setShowLoader(false);
      });
  };

  useEffect(() => {
    searchProblems();
  }, []);
  if (loader) {
    return (<div className={classes.div}><LinearProgress /></div>);
  }
  console.log(problems)
  return (
    <div>
      {problems.length === 0 &&
        <div className="text-center">No Problems found</div>
      }
      {problems.length > 0 &&
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>(#)</TableCell>
                <TableCell align="left">Problem Type</TableCell>
                <TableCell align="left">Recorded Date</TableCell>
                <TableCell align="left">Clinical Status</TableCell>
                {/* <TableCell align="right">Participant</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {problems !== undefined && problems.map((row, key) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {key + 1}
                  </TableCell>
                  <TableCell align="left">
                    {row.resource.code.text}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {moment(row.resource.recordedDate).format("LL")}
                  </TableCell>
                  <TableCell align="left">
                    {row.resource.clinicalStatus?.text}
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
export default ProblemsDesplay;
