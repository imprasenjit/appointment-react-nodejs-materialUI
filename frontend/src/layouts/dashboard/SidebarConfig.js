import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';


// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Appointments',
    path: '/dashboard/appointments',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Patients',
    path: '/dashboard/patients',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Slots',
    path: '/dashboard/slots',
    icon: getIcon('bx:bx-time')
  }
];

export default sidebarConfig;
