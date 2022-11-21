// i18n
import './locales/i18n';

// highlight
import './utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// lightbox
import 'react-image-lightbox/style.css';

// editor
import 'react-quill/dist/quill.snow.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {Provider as ReduxProvider} from 'react-redux';
// material
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
// redux
import {store} from './redux/store';
// contexts
import {SettingsProvider} from './contexts/SettingsContext';
import {CollapseDrawerProvider} from './contexts/CollapseDrawerContext';
// components
import App from './App';

// ----------------------------------------------------------------------

ReactDOM.render(
    <HelmetProvider>
        <ReduxProvider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SettingsProvider>
                    <CollapseDrawerProvider>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </CollapseDrawerProvider>
                </SettingsProvider>
            </LocalizationProvider>
        </ReduxProvider>
    </HelmetProvider>,
    document.getElementById('root'),
);
