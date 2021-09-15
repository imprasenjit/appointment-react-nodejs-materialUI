
import { useState, useEffect } from 'react';
import { get, isEmpty } from "lodash";
import { Link as RouterLink, useParams } from 'react-router-dom';
// material
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination
} from '@material-ui/core';
// components
import Page from '../components/Page';
//
import { httpCall, getClientCredientials } from '../middleware/axios-utils';
import Home from '../components/PatientApp/Home';
import { demographicAPI } from "../config";

// ----------------------------------------------------------------------
export default function ViewPatient() {
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
        getPatientInfo();
    }, []);

    return (
        <Page title="View Patient">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                        {get(patientInfo, "name[0].text")}
                    </Typography>
                </Stack>
                <Card>
                    <Home patientID={patientID} />
                </Card>
            </Container>
        </Page>
    );
}
