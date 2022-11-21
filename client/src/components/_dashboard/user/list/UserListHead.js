import PropTypes from 'prop-types';
// material
import {visuallyHidden} from '@material-ui/utils';
import {Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

UserListHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    rowCount: PropTypes.number,
    headLabel: PropTypes.array,
    numSelected: PropTypes.number,
    onRequestSort: PropTypes.func,
    onSelectAllClick: PropTypes.func
};

export default function UserListHead({
                                         order,
                                         orderBy,
                                         rowCount,
                                         headLabel,
                                         numSelected,
                                         onRequestSort,
                                         onSelectAllClick
                                     }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const isAdmin = !!useSelector(state => state.user.current?.role) === "ADMIN";

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {isAdmin && <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />}
                </TableCell>
                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.alignRight ? 'right' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box
                                    sx={{...visuallyHidden}}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}