import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import {PATH_DASHBOARD} from "../../routes/paths";
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
    Typography
} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import {Icon} from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import Page from "../../components/Page";
import {useEffect, useState} from "react";
import {API_BASE_URL, URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {getData, putData} from "../../_helper/httpProvider";
import CourseToolbar from "../../components/_dashboard/course/list/CourseToolbar";
import Scrollbar from "../../components/Scrollbar";
import CourseHead from "../../components/_dashboard/course/list/CourseHead";
import CourseMoreMenu from "../../components/_dashboard/course/list/CourseMoreMenu";
import {MIconButton} from "../../components/@material-extend";
import {useSnackbar} from "notistack5";
import closeFill from "@iconify/icons-eva/close-fill";
import {formatDateTime} from "../../_helper/formatDate";
import SearchNotFound from "../../components/SearchNotFound";

//-----------------------------------------------------------------------------------------------
const TABLE_HEAD = [
    {id: 'makh', label: 'Mã khóa học', alignRight: false},
    {id: 'tenkh', label: 'Khóa học', alignRight: false},
    {id: 'kh_ngaytao', label: 'Ngày tạo', alignRight: false},
    {id: 'kh_trang thai', label: 'Trạng thái', alignRight: false},
    {id: ''},
];
export default function Course() {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [selected, setSelected] = useState([]);
    const [courses, setCourse] = useState([]);
    const [page, setPage] = useState(0);
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [load, setLoad] = useState(0);

    // useEffect

    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + `/api/khoahoc?search=${filterName}`);
            setCourse(_res.data);
        })()
    }, [load, filterName])

    // function
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = courses.map((n) => n.kh_id);
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

    const changeActive = async (id, active) => {
        try {
            const res = await putData(API_BASE_URL + '/api/khoahoc-active', {
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

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courses.length) : 0;

    const isCoursesNotFound = courses.length === 0;


    return <>
        <Page title="Khóa học">
            <Container>
                <HeaderBreadcrumbs
                    heading="Khóa học"
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Khóa học', href: PATH_DASHBOARD.course.root},
                        {name: 'Danh sách'},
                    ]}
                    action={
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to={PATH_DASHBOARD.course.new}
                            startIcon={<Icon icon={plusFill}/>}
                        >
                            Khóa học mới
                        </Button>
                    }
                />

                <Card>
                    <CourseToolbar
                        selected={selected}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        setLoad={setLoad}
                        setSelected={setSelected}
                    />
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <CourseHead
                                    headLabel={TABLE_HEAD}
                                    rowCount={courses.length}
                                    numSelected={selected.length}
                                    onSelectAllClick={handleSelectAllClick}
                                />

                                <TableBody>
                                    {courses
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const {
                                                kh_id,
                                                kh_makh,
                                                kh_ten,
                                                kh_hinhanh,
                                                active,
                                                kh_create_at
                                            } = row;
                                            const isItemSelected = selected.indexOf(kh_id) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={kh_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleClick(event, kh_id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="subtitle2" noWrap>
                                                                {kh_makh}
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
                                                                alt={kh_makh}
                                                                sx={{mr: 1}}
                                                                src={`${
                                                                    URL_PUBLIC_IMAGES + kh_hinhanh
                                                                }`}
                                                            />
                                                            {kh_ten}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{formatDateTime(kh_create_at)}</Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Switch
                                                            checked={active === 1}
                                                            onChange={() => {
                                                                changeActive(kh_id, !active);
                                                            }}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <CourseMoreMenu id={kh_id}/>
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
                                {isCoursesNotFound && (
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
                        count={courses.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    </>
}