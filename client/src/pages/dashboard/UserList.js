import {Icon} from '@iconify/react';
import {useEffect, useState} from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
    Button,
    Card,
    Checkbox,
    Container,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from '@material-ui/core';
// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {UserListHead, UserListToolbar, UserMoreMenu,} from '../../components/_dashboard/user/list';
import {getData, postData} from '../../_helper/httpProvider';
import {API_BASE_URL} from '../../config/configUrl';
import {useSnackbar} from 'notistack5';
import {MIconButton} from '../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'fullname', label: 'Họ tên', alignRight: false},
    {id: 'email', label: 'Email', alignRight: false},
    {id: 'phone', label: 'Số điên thoại', alignRight: false},
    {id: 'role', label: 'Quyền', alignRight: false},
    {id: 'isVerified', label: 'Xác minh tài khoản', alignRight: false},
    {id: 'status', label: 'Trạng thái', alignRight: false},
    {id: ''},
];


// ----------------------------------------------------------------------

export default function UserList() {
    const {themeStretch} = useSettings();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [load, setLoad] = useState(0);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const isAdmin = useSelector(state => state.user.current?.role) === "ADMIN";


    useEffect(() => {
        (async () => {
            try {
                const res = await getData(API_BASE_URL + `/users?search=${filterName}`);
                setUsers(res.data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [filterName, load]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = users.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const isUserNotFound = users.length === 0;

    const changeActiveUser = async (id, active) => {
        try {
            const res = await postData(API_BASE_URL + '/user/active', {
                id: id,
                active: active,
            });
            setLoad((e) => e + 1);
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
        <Page title="User: List | LearnCode">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Danh sách người dùng"
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Người dùng', href: PATH_DASHBOARD.user.list},
                        {name: 'Danh sách'},
                    ]}
                    action={
                        isAdmin && <Button
                            variant="contained"
                            component={RouterLink}
                            to={PATH_DASHBOARD.user.new}
                            startIcon={<Icon icon={plusFill}/>}
                        >
                            Thêm tài khoản
                        </Button>
                    }
                />

                <Card>
                    <UserListToolbar
                        selected={selected}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        setLoad={setLoad}
                        setSelected={setSelected}
                    />
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={users.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {users
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const {
                                                id,
                                                fullname,
                                                email,
                                                phone,
                                                role,
                                                verify,
                                                active,
                                            } = row;
                                            const isItemSelected = selected.indexOf(id) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        {isAdmin && <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleClick(event, id)}
                                                        />}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="subtitle2" noWrap>
                                                                {fullname}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{email}</TableCell>
                                                    <TableCell align="left">{phone}</TableCell>
                                                    <TableCell align="left">{role}</TableCell>
                                                    <TableCell align="left">
                                                        {verify ? 'Đã xác minh' : 'Chưa'}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {isAdmin && <Switch
                                                            checked={active === 1}
                                                            onChange={() => {
                                                                changeActiveUser(id, !active);
                                                            }}
                                                        />}
                                                        {!isAdmin && <Typography>
                                                            {active ? 'Hiện' : 'Ần'}
                                                        </Typography>}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {isAdmin && <UserMoreMenu id={id}/>}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>
                                {
                                    isUserNotFound && (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                    <SearchNotFound searchQuery={filterName}/>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )
                                }
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    )
        ;
}