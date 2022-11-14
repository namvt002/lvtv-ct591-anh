import PropTypes from 'prop-types';
import {Icon} from '@iconify/react';
import {useRef, useState} from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import {Link as RouterLink} from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem,} from '@material-ui/core';
// routes
import {PATH_DASHBOARD} from '../../../../routes/paths';

// ----------------------------------------------------------------------

CourseMoreMenu.propTypes = {
    id: PropTypes.string,
};

export default function CourseMoreMenu({id}) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Icon icon={moreVerticalFill} width={20} height={20}/>
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: {width: 200, maxWidth: '100%'},
                }}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuItem
                    component={RouterLink}
                    to={`${PATH_DASHBOARD.course.root}/${id}/edit`}
                    sx={{color: 'text.secondary'}}
                >
                    <ListItemIcon>
                        <Icon icon={editFill} width={24} height={24}/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Chỉnh sửa"
                        primaryTypographyProps={{variant: 'body2'}}
                    />
                </MenuItem>
            </Menu>
        </>
    );
}
