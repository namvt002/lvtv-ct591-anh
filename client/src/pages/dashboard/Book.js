import {Icon} from '@iconify/react';
import {useEffect, useState} from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
    Avatar,
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
import {useSnackbar} from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import {getData, postData} from "../../_helper/httpProvider";
import {API_BASE_URL, URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {MIconButton} from "../../components/@material-extend";
import BookListToolbar from "../../components/_dashboard/book/list/BookListToolbar";
import BookListHead from "../../components/_dashboard/book/list/BookListHead";
import BookMoreMenu from "../../components/_dashboard/book/list/BookMoreMenu";
import {useSelector} from "react-redux";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'sp_masp', label: 'Mã sách', alignRight: false},
    {id: 'sp_ten', label: 'Tên sách', alignRight: false},
    {id: 'sp_nxb', label: 'Nhà xuất bản', alignRight: false},
    {id: 'sp_tg', label: 'Tác giả', alignRight: false},
    {id: 'sp_tl', label: 'Thể loại', alignRight: false},
    {id: 'sp_nn', label: 'Ngôn ngữ', alignRight: false},
    {id: 'status', label: 'Trạng thái', alignRight: false},
    {id: ''},
];

// ----------------------------------------------------------------------

export default function BookList() {
    const {themeStretch} = useSettings();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [_datas, setDatas] = useState([]);
    const [load, setLoad] = useState(0);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const isAdmin = useSelector(state => state.user.current.role) === "ADMIN";

    useEffect(() => {
        (async () => {
            try {
                const res = await getData(API_BASE_URL + `/books?search=${filterName}`);
                setDatas(res.data);
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
            const newSelecteds = _datas.map((n) => n.sp_id);
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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - _datas.length) : 0;

    const isBooksNotFound = _datas.length === 0;

    const changeActiveBook = async (id, active) => {
        try {
            const res = await postData(API_BASE_URL + '/book/active', {
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
        <Page title="Book: List | HYPE">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Sách"
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Sách', href: PATH_DASHBOARD.user.list},
                        {name: 'Danh sách'},
                    ]}
                    action={
                       isAdmin && <Button
                            variant="contained"
                            component={RouterLink}
                            to={PATH_DASHBOARD.book.new}
                            startIcon={<Icon icon={plusFill}/>}
                        >
                            Thêm sách
                        </Button>
                    }
                />

                <Card>
                    <BookListToolbar
                        selected={selected}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        setLoad={setLoad}
                        setSelected={setSelected}
                    />
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <BookListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={_datas.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {_datas
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const {
                                                sp_id,
                                                sp_masp,
                                                sp_ten,
                                                sp_hinhanh,
                                                nxb_ten,
                                                tg_ten,
                                                tl_ten,
                                                nn_ten,
                                                active,
                                            } = row;
                                            const isItemSelected = selected.indexOf(sp_id) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={sp_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        {isAdmin &&  <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleClick(event, sp_id)}
                                                        />}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="subtitle2" noWrap>
                                                                {sp_masp}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >
                                                            <Avatar
                                                                variant="square"
                                                                alt={sp_masp}
                                                                sx={{mr: 1}}
                                                                src={`${
                                                                    URL_PUBLIC_IMAGES + sp_hinhanh[sp_hinhanh.length - 1]?.ha_hinh
                                                                }`}
                                                            />
                                                            {sp_ten}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{nxb_ten}</TableCell>
                                                    <TableCell align="left">{tg_ten}</TableCell>
                                                    <TableCell align="left">{tl_ten}</TableCell>
                                                    <TableCell align="left">{nn_ten}</TableCell>
                                                    <TableCell align="left">
                                                        { isAdmin && <Switch
                                                            checked={active === 1}
                                                            onChange={() => {
                                                                changeActiveBook(sp_id, !active);
                                                            }}
                                                        />}
                                                        {!isAdmin && <Typography color='lightgreen'>{active ? 'Hiện' : 'Ẩn'}</Typography>}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {  isAdmin && <BookMoreMenu id={sp_id}/>}
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
                                {isBooksNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <SearchNotFound searchQuery={filterName}/>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={_datas.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
}
