import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import { Card, CardHeader, Box } from '@material-ui/core';
import moment from "moment";

import { BaseOptionChart } from '../../charts';
import { httpCall, getClientCredientials } from "../../../middleware/axios-utils";
import { observationAPI } from "../../../config";
// ----------------------------------------------------------------------
import LinearProgress from "@material-ui/core/LinearProgress";
const CHART_DATA = [
  {
    name: 'Blood Pressure',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
  }
];

export default function ObservationChart({ patientId }) {
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
  // if (loader) {
  //   return (<div className={classes.div}><LinearProgress /></div>);
  // }

  const dataValue = observations.map((ob) => {
    return ob.resource.valueQuantity?.value;
  });
  console.log(dataValue);
  const chartOptions = merge({
    stroke: {
      curve: 'smooth',
    },
    labels: [
      '01/01/2003',
      '02/01/2003',
      '03/01/2003',
      '04/01/2003',
      '05/01/2003',
      '06/01/2003',
      '07/01/2003',
      '08/01/2003',
      '09/01/2003',
      '10/01/2003',
      '11/01/2003'
    ],
    xaxis: { type: 'datetime' },
    fill: {
      type: 'solid',
      opacity: [0.35, 1],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Observation laboratory" subheader="(+43%) than last year" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
