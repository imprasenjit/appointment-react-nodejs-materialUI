import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import { Container, Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { Link, useParams } from "react-router-dom";
import "./styles.css";
import Demographic from "./Patient.component";
import Appointment from "./Appointment.component";
import Observations from "./Observations";
import Medications from "./Medications.component";
import Allergies from "./Allergies.component";
import Problems from "./Problems.component";
import Procedures from "./Procedures.component";
import Immunization from "./Immunization.component";
import SocialHistory from "./ObservationSocialHistory.component";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },

  TabButtons: {
    alignItems: "end",
    Opacity: "0.5",
  },
  paper: {
    width: "100%",
  },
  backdrop: {
    color: "#fff",
    textAlign: "center",
  },
}));
const Home = (props) => {
  const { patientID } = props;
  console.log("Home", patientID);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className='app-container'>
      <Container maxWidth={"lg"}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={classes.root}>
              <Grid container>
                <Grid item xs={12} sm={4} md={2} lg={2}>
                  <br />
                  <Tabs
                    orientation='vertical'
                    variant='scrollable'
                    value={value}
                    onChange={handleChange}
                    aria-label='Vertical tabs example'
                    className={classes.tabs}>
                    <Tab
                      className={classes.TabButtons}
                      label='Demogaphic'
                      {...a11yProps(0)}
                    />
                    <Tab
                      className={classes.TabButtons}
                      label="Appointment"
                      {...a11yProps(1)}
                    />
                    <Tab
                      className={classes.TabButtons}
                      label='Allergies'
                      {...a11yProps(2)}
                    />
                    <Tab
                      className={classes.TabButtons}
                      label='Medications'
                      {...a11yProps(3)}
                    />
                    <Tab
                      className={classes.TabButtons}
                      label='Problems'
                      {...a11yProps(4)}
                    />
                    <Tab
                      className={classes.TabButtons}
                      label='Procedures'
                      {...a11yProps(5)}
                    />
                    <Tab
                      className={classes.TabButtons}
                      label='Immunizations'
                      {...a11yProps(6)}
                    />
                    <Tab
                      className={classes.TabButtons}
                      label='Observations'
                      {...a11yProps(7)}
                    />
                    <Tab
                      className={classes.TabButtons}
                      label="Social History"
                      {...a11yProps(8)}
                    />
                  </Tabs>
                </Grid>
                <Grid item xs={12} sm={8} md={10} lg={10}>
                  <TabPanel className={classes.TabPanel} value={value} index={0}>
                    <Paper className={classes.paper}>
                      {" "}
                      <Demographic patientId={patientID}></Demographic>
                    </Paper>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Appointment patientId={patientID} />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Allergies patientId={patientID}></Allergies>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <Medications patientId={patientID}></Medications>
                  </TabPanel>
                  <TabPanel value={value} index={4}>
                    <Problems patientId={patientID}></Problems>
                  </TabPanel>
                  <TabPanel value={value} index={5}>
                    <Procedures patientId={patientID}></Procedures>
                  </TabPanel>
                  <TabPanel value={value} index={6}>
                    <Immunization patientId={patientID}></Immunization>
                  </TabPanel>
                  <TabPanel value={value} index={7}>
                    <Observations patientId={patientID}></Observations>
                  </TabPanel>
                  <TabPanel value={value} index={8}>
                    <SocialHistory patientId={patientID} />
                  </TabPanel>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default Home;
