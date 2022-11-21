import {Outlet} from 'react-router-dom';
// material
// components
//
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';
import {styled} from "@material-ui/core";
import Page from "../../components/Page";

// ----------------------------------------------------------------------
const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));
export default function MainLayout() {
    return (
        <>
            <div>
                <MainNavbar/>
                <RootStyle>
                    <Outlet/>
                </RootStyle>
                <MainFooter/>
            </div>
        </>
    );
}
