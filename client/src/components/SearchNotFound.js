import PropTypes from 'prop-types';
// material
import {Paper, Typography} from '@material-ui/core';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
    searchQuery: PropTypes.string
};

export default function SearchNotFound({searchQuery = '', ...other}) {
    return (
        <Paper {...other}>
            <Typography gutterBottom align="center" variant="subtitle1">
                Không tìm thấy
            </Typography>
            <Typography variant="body2" align="center">
                Không có kết quả nào cho &nbsp;
                <strong>&quot;{searchQuery}&quot;</strong>. Vui lòng kiểm tra lại!.
            </Typography>
        </Paper>
    );
}
