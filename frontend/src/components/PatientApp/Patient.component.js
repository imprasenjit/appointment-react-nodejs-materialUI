import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
import { get, isEmpty } from "lodash";
import axios from "axios";
import merge from "lodash/merge";
import LinearProgress from "@material-ui/core/LinearProgress";
import { httpCall, getClientCredientials } from "../../middleware/axios-utils";
import { demographicAPI } from "../../config";

const PatientDetails = ({ patientId }) => {
  console.log("PatientCOmponent", patientId)
  const [patientInfo, setPatientInfo] = useState({});
  const getPatientInfo = async () => {
    const reqConfig = {
      url: demographicAPI,
      method: "post",
      data: { patientid: patientId }
    };
    await httpCall(reqConfig)
      .then((res) => {
        console.log("resData", res.data);
        setPatientInfo(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          getClientCredientials();
          getPatientInfo();
        } else {
          console.log(error);
          // history.push("/");
        }
        // setShowLoader(false);
      });
    // console.log(queryParams);
  };

  useEffect(() => {
    getPatientInfo();
  }, []);
  console.log(patientInfo);
  if (isEmpty(patientInfo)) {
    return <LinearProgress />;
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <div className='text-left'>Patient ID</div>
      </Grid>
      <Grid item xs={9}>
        : {patientInfo.id}
        <Divider light />
      </Grid>

      <Grid item xs={3}>
        <div className='text-left'> SSN</div>
      </Grid>
      <Grid item xs={9}>
        : {get(patientInfo, "identifier[0].value", "")}
        <Divider light />
      </Grid>

      <Grid item xs={3}>
        <div className='text-left'>Name</div>
      </Grid>
      <Grid item xs={9}>
        : {get(patientInfo, "name[0].text", "")}
        <Divider light />
      </Grid>
      <Grid item xs={3}>
        <div className='text-left'>Gender</div>
      </Grid>
      <Grid item xs={3}>
        : {get(patientInfo, "gender", "")}
        <Divider light />
      </Grid>

      <Grid item xs={3}>
        <div className='text-left'>Marital Status</div>
      </Grid>
      <Grid item xs={3}>
        : {get(patientInfo, "maritalStatus.text", "")}
        <Divider light />
      </Grid>
      <Grid item xs={3}>
        <div className='text-left'>Date Of Birth</div>
      </Grid>
      <Grid item xs={9}>
        : {moment(get(patientInfo, "birthDate", "")).format("LL")}
        <Divider light />
      </Grid>
      <Grid item xs={3}>
        <div className='text-left'>General Practitioner</div>
      </Grid>
      <Grid item xs={9}>
        : {get(patientInfo, "generalPractitioner[0].display", "")}
        <Divider light />
      </Grid>

      <Grid item xs={3}>
        <div className='text-left'>Telecom</div>
      </Grid>
      <Grid item xs={9}>
        : {get(patientInfo, "telecom[0].value", "")}
        <Divider light />
      </Grid>
      <Grid item xs={3}>
        <div className='text-left'>Address Line</div>
      </Grid>
      <Grid item xs={9}>
        : {get(patientInfo, "address[0].line[0]", "")}
        <Divider light />
      </Grid>
      <Grid item xs={3}>
        <div className='text-left'>City</div>
      </Grid>
      <Grid item xs={3}>
        : {get(patientInfo, "address[0].city", "")}
        <Divider light />
      </Grid>
      <Grid item xs={3}>
        <div className='text-left'>Postal Code</div>
      </Grid>
      <Grid item xs={3}>
        : {get(patientInfo, "address[0].postalCode", "")}
        <Divider light />
      </Grid>
      <Grid item xs={3}>
        <div className='text-left'>State</div>
      </Grid>
      <Grid item xs={3}>
        : {get(patientInfo, "address[0].state", "")}
        <Divider light />
      </Grid>
      <Grid item xs={3}>
        <div className='text-left'>Country</div>
      </Grid>
      <Grid item xs={3}>
        : {get(patientInfo, "address[0].country", "")}
        <Divider light />
      </Grid>
    </Grid>
  );
};
export default React.memo(PatientDetails);
