import {useState} from 'react';
import {Outlet} from 'react-router-dom';
// material
import {styled, useTheme} from '@material-ui/core/styles';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
//
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
});

const MainStyle = styled('div')(({theme}) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: 48,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
    const theme = useTheme();
    const {collapseClick} = useCollapseDrawer();
    const [open, setOpen] = useState(false);

    return (
        <RootStyle>
            <DashboardSidebar
                isOpenSidebar={open}
                onCloseSidebar={() => setOpen(false)}
            />
            <MainStyle
                sx={{
                    transition: theme.transitions.create('margin', {
                        duration: theme.transitions.duration.complex,
                    }),
                    ...(collapseClick && {
                        ml: '102px',
                    }),
                }}
            >
                <Outlet/>
            </MainStyle>
        </RootStyle>
    );
}
