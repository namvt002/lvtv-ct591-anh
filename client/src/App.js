// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// hooks
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';
import NotistackProvider from './components/NotistackProvider';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import ThemeLocalization from './components/ThemeLocalization';
import {useEffect} from "react";
import {getStore} from "./redux/slices/store";
import {useDispatch} from "react-redux";

// ----------------------------------------------------------------------

export default function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getStore());
    }, [dispatch]);

    return (
        <ThemeConfig>
            <ThemePrimaryColor>
                <ThemeLocalization>
                    <RtlLayout>
                        <NotistackProvider>
                            <Settings/>
                            <ScrollToTop/>
                            <GoogleAnalytics/>
                            <Router/>
                        </NotistackProvider>
                    </RtlLayout>
                </ThemeLocalization>
            </ThemePrimaryColor>
        </ThemeConfig>
    );
}
