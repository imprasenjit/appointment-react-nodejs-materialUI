import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
// import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Appointments from './pages/Appointments';
import Slots from './pages/Slots';
import PatientAppointment from './pages/CreateAppointment';
import ViewPatient from './pages/ViewPatient';
import PatientDashboard from './pages/PatientDashboard';
// import Register from './pages/Register';
// import DashboardApp from './pages/DashboardApp';
// import Products from './pages/Products';
// import Blog from './pages/Blog';
import Patients from './pages/Patients';
// import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/appointment',
      element: <PatientAppointment />
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'appointments', element: <Appointments /> },
        { path: 'patients', element: <Patients /> },
        { path: 'viewPatient/:patientID', element: <ViewPatient /> },
        { path: 'patientdashboard/:patientID', element: <PatientDashboard /> },
        { path: 'slots', element: <Slots /> },
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
