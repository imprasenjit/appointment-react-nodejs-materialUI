
import { useState, useEffect } from 'react';
import { get, isEmpty } from "lodash";
import { Link as RouterLink, useParams } from 'react-router-dom';
// material
import { Box, Grid, Container, Typography } from '@material-ui/core';

// components
import Page from '../components/Page';
import {
    AppNewUsers,
    AppBugReports,
    AppItemOrders,
    AppWeeklySales,
    ObservationChart, SocialHistory
} from '../components/_dashboard/app';
import { httpCall, getClientCredientials } from '../middleware/axios-utils';
import Home from '../components/PatientApp/Home';
import { demographicAPI } from "../config";

// ----------------------------------------------------------------------
export default function PatientDashboard() {
    let { patientID } = useParams();
    const [patientInfo, setPatientInfo] = useState({});
    const getPatientInfo = async () => {
        const reqConfig = {
            url: demographicAPI,
            method: "post",
            data: { patientid: patientID }
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
        // fetchPatients();
        getClientCredientials();
    }, []);
    useEffect(() => {
        getPatientInfo();
    }, []);

    return (
        <Page title="Patient Dashboard">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">{get(patientInfo, "name[0].text")}</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6}>
                        <ObservationChart patientId={patientID} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <SocialHistory patientId={patientID} />
                    </Grid>
                </Grid>

            </Container>
        </Page>
    );
}
