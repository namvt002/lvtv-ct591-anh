import PropTypes from 'prop-types';
import {Icon} from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import {styled, useTheme} from '@material-ui/core/styles';
import {Box, IconButton, InputAdornment, OutlinedInput, Toolbar, Tooltip, Typography,} from '@material-ui/core';
import {API_BASE_URL} from '../../../../config/configUrl';
import {deleteData} from '../../../../_helper/httpProvider';
import {useSnackbar} from 'notistack5';
import {MIconButton} from '../../../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import {useState} from 'react';
import DialogConfirm from '../../DialogConfirm';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({theme}) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({theme}) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {width: 320, boxShadow: theme.customShadows.z8},
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`,
    },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    setLoad: PropTypes.func,
    setSelected: PropTypes.func,
};
// ----------------------------------------------------------------------
export default function UserListToolbar({
                                            selected,
                                            filterName,
                                            onFilterName,
                                            setLoad,
                                            setSelected,
                                        }) {
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';
    const numSelected = selected.length;
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteUser = async () => {
        try {
            const res = await deleteData(API_BASE_URL + '/user/delete', {
                arrID: JSON.stringify(selected),
            });
            if (setLoad) setLoad((e) => e + 1);
            if (setSelected) setSelected([]);
            enqueueSnackbar(res.data, {
                variant: 'success',
                action: (key) => (
                    <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill}/>
                    </MIconButton>
                ),
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <RootStyle
                sx={{
                    ...(numSelected > 0 && {
                        color: isLight ? 'primary.main' : 'text.primary',
                        bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography component="div" variant="subtitle1">
                        {numSelected} hàng được chọn
                    </Typography>
                ) : (
                    <SearchStyle
                        value={filterName}
                        onChange={onFilterName}
                        placeholder="Tìm kiếm tài khoản..."
                        startAdornment={
                            <InputAdornment position="start">
                                <Box
                                    component={Icon}
                                    icon={searchFill}
                                    sx={{color: 'text.disabled'}}
                                />
                            </InputAdornment>
                        }
                    />
                )}

                {numSelected > 0 ? (
                    <Tooltip title="Xóa">
                        <IconButton onClick={() => handleClickOpen()}>
                            <Icon icon={trash2Fill}/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton>
                            <Icon icon={roundFilterList}/>
                        </IconButton>
                    </Tooltip>
                )}
            </RootStyle>
            <DialogConfirm
                open={open}
                handleClose={handleClose}
                message={
                    <Typography color="error" variant="h4" align="center">
                        Bạn chắc chắn muốn xóa?
                    </Typography>
                }
                excFunc={deleteUser}
            />
        </>
    );
}