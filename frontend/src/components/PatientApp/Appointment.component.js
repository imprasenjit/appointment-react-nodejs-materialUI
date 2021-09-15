import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { httpCall, cernerAPI, getClientCredientials } from "../../middleware/axios-utils";
import { appointmentAPI } from "../../config";


import LinearProgress from "@material-ui/core/LinearProgress";

// import moment from "moment";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  card: {
    backgroundColor: '#FFF',
    flexGrow: 1,
  },
}));
const AppointmentsDisplay = ({ patientId }) => {
  const classes = useStyles();
  const [appointments, setAppointments] = useState([]);
  const [loader, setLoader] = useState(false);

  // console.log("patientId"+patientInfo?.id)
  const searchAppointments = async () => {
    setLoader(true);
    const reqConfig = {
      url: appointmentAPI,
      method: "post",
      data: { patientid: patientId }
    };
    await httpCall(reqConfig)
      .then((res) => {
        console.log("resData", res.data);
        let obArray = res.data.entry;
        obArray.pop();
        setAppointments(obArray);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          getClientCredientials();
          searchAppointments();
        } else {
          console.log(error);
          setLoader(false);
          // history.push("/");
        }
        // setShowLoader(false);
      });

  };

  useEffect(() => {
    searchAppointments();
  }, []);
  if (loader) {
    return (
      <div className={classes.div}>
        <LinearProgress />
      </div>
    );
  }
  return (
    <div>
      {appointments.length === 0 && (
        <div className='text-center'>No Appointments found</div>
      )}
      {appointments.length > 0 && (
        <Grid container className={classes.root} spacing={2}>
          {appointments !== undefined &&
            appointments.map((row, key) => (
              <Grid item xs={4} key={key}>
                <Card className={classes.card}>
                  <CardContent>
                    #{key + 1}
                    <div
                      className='description'
                      dangerouslySetInnerHTML={{
                        __html: row.resource?.text?.div,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </div>
  );
};
export default AppointmentsDisplay;
