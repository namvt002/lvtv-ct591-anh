import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import {PATH_DASHBOARD} from "../../routes/paths";
import {Button, Container} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import {Icon} from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import Page from "../../components/Page";
// import {useState} from "react";

//-----------------------------------------------------------------------------------------------
export default function Course(){
    // const [course, setCourse] = useState();

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
                            to={PATH_DASHBOARD.phieunhap.new}
                            startIcon={<Icon icon={plusFill}/>}
                        >
                            Khóa học mới
                        </Button>
                    }
                />
            </Container>
        </Page>
    </>
}