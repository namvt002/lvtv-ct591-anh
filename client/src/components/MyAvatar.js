// hooks
//
import {MAvatar} from './@material-extend';
import createAvatar from '../utils/createAvatar';
import {useSelector} from 'react-redux';
import {randomIntFromInterval} from "../_helper/helper";

// ----------------------------------------------------------------------

export default function MyAvatar({...other}) {
    const user = useSelector((state) => state.user.current);
    const cover = useSelector((state) => state.user.cover);

    return (
        <MAvatar
            src={cover || `/static/avatar_${randomIntFromInterval(1, 20)}.jpg`}
            alt={user?.fullname}
            color={cover ? 'default' : createAvatar(user.fullname).color}
            {...other}
        >
            {createAvatar(user.fullname).name}
        </MAvatar>
    );
}
