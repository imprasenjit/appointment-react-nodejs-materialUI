import { useState, useEffect } from "react";
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
import LinearProgress from "@material-ui/core/LinearProgress";
import { proceduresAPI } from "../../config";

// import moment from "moment";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const ProceduresDesplay = ({ patientId }) => {
  const classes = useStyles();

  const [loader, setLoader] = useState(false);

  const [procedures, setProcedures] = useState([])
  // console.log("patientId"+patientInfo?.id)
  const searchProcedures = async () => {
    setLoader(true);
    // const url = `${cernerAPI}/Procedure?patient=${patientId}`;
    const reqConfig = {
      url: proceduresAPI,
      method: "post",
      data: { patientid: patientId }
    };
    await httpCall(reqConfig)
      .then((res) => {
        console.log("resData", res.data);
        let obArray = res.data.entry;
        obArray.pop();
        setProcedures(obArray);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          getClientCredientials();
          searchProcedures();
        } else {
          console.log(error);
          setLoader(false);
          // history.push("/");
        }
        // setShowLoader(false);
      });
  };

  useEffect(() => {
    searchProcedures();
  }, []);
  if (loader) {
    return (<div className={classes.div}><LinearProgress /></div>);
  }
  console.log(procedures)
  return (
    <div>
      {procedures.length === 0 &&
        <div className="text-center">No Procedures found</div>
      }
      {procedures.length > 0 &&
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>(#)</TableCell>
                <TableCell align="left">Procedure</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Status</TableCell>
                {/* <TableCell align="right">Participant</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {procedures !== undefined && procedures.map((row, key) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {key + 1}
                  </TableCell>
                  <TableCell align="left">
                    {row.resource.code?.coding[0].display}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.resource?.performedDateTime ? moment(row.resource?.performedDateTime).format("LL") : 'N/A'}
                  </TableCell>
                  <TableCell align="left">
                    {row.resource?.status}
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
export default ProceduresDesplay;
