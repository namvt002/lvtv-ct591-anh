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
import {getData, postData} from '../../_helper/httpProvider';
import {API_BASE_URL} from '../../config/configUrl';
import PhieuNhapListHead from '../../components/_dashboard/phieunhap/list/PhieuNhapListHead';
import PhieuNhapToolbar from '../../components/_dashboard/phieunhap/list/PhieuNhapToolbar';
import {fCurrency} from '../../_helper/formatCurrentCy';
import {formatDateTime} from '../../_helper/formatDate';
import PhieuNhapMoreMenu from '../../components/_dashboard/phieunhap/list/PhieuNhapMoreMenu';
import {MIconButton} from "../../components/@material-extend";
import closeFill from "@iconify/icons-eva/close-fill";
import {useSnackbar} from "notistack5";
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'pn_id', label: 'Mã Phiếu Nhập', alignRight: false},
    {id: 'pn_idnv', label: 'Mã Nhân Viên', alignRight: false},
    {id: 'pn_tennv', label: 'Tên Nhân Viên', alignRight: false},
    {id: 'pn_ncc', label: 'Nhà Cung Cấp', alignRight: false},
    {id: 'pn_tongtien', label: 'Tổng Tiền', alignRight: false},
    {id: 'pn_ngaynhap', label: 'Ngày Nhập', alignRight: false},
    {id: 'pn_trangthai', label: 'Trạng thái', alignRight: false},
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
                const res = await getData(
                    API_BASE_URL + `/phieunhap?search=${filterName}`,
                );
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

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = _datas.map((n) => n.pn_id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
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

    const isUserNotFound = _datas.length === 0;

    const changeActivePN = async (id, active) => {
        try {
            const res = await postData(API_BASE_URL + '/phieunhap/active', {
                id: id,
                pn_active: active,
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
        <Page title="PN | HYPE">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Nhập hàng"
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Sách', href: PATH_DASHBOARD.phieunhap.root},
                        {name: 'Nhập hàng'},
                    ]}
                    action={
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to={PATH_DASHBOARD.phieunhap.new}
                            startIcon={<Icon icon={plusFill}/>}
                        >
                            Phiếu nhập mới
                        </Button>
                    }
                />

                <Card>
                    <PhieuNhapToolbar
                        selected={selected}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        setLoad={setLoad}
                        setSelected={setSelected}
                    />
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <PhieuNhapListHead
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
                                                pn_id,
                                                pn_idnv,
                                                fullname,
                                                ncc_ten,
                                                pn_tongtien,
                                                pn_ngaylapphieu,
                                                pn_active
                                            } = row;
                                            const isItemSelected = selected.indexOf(pn_id) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={pn_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        { isAdmin &&  <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) =>
                                                                handleClick(event, pn_id)
                                                            }
                                                        />}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        component="th"
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        <Typography variant="subtitle2" noWrap>
                                                            {pn_id}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">{pn_idnv}</TableCell>
                                                    <TableCell align="left">{fullname}</TableCell>
                                                    <TableCell align="left">{ncc_ten}</TableCell>
                                                    <TableCell align="left" sx={{width: '8rem'}}>
                                                        {fCurrency(pn_tongtien)}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {formatDateTime(pn_ngaylapphieu)}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {(!pn_active && isAdmin) && <Switch
                                                            checked={pn_active === 1}
                                                            onChange={() => {
                                                                changeActivePN(pn_id, !pn_active);
                                                            }}
                                                        />}

                                                        {!!pn_active && <Typography color='blueviolet'>Đã nhập</Typography>}

                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <PhieuNhapMoreMenu id={pn_id} active={pn_active}/>
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
                                {isUserNotFound && (
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
