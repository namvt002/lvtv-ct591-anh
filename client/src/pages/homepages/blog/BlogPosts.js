import {orderBy} from 'lodash';
import {Icon} from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import {Link as RouterLink} from 'react-router-dom';
import {useState} from 'react';
// material
import {Box, Button, Container, Grid, Skeleton, Stack} from '@material-ui/core';
// redux
// import { useDispatch, useSelector } from '../../redux/store';
// import { getPostsInitial, getMorePosts } from '../../redux/slices/blog';
// hooks
// import useSettings from '../../hooks/useSettings';
// routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// components
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import BlogPostsSearch from './BlogPostsSearch';
import BlogPostsSort from './BlogPostsSort';
import {PATH_PAGE} from 'src/routes/paths';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
    {value: 'latest', label: 'Latest'},
    {value: 'popular', label: 'Popular'},
    {value: 'oldest', label: 'Oldest'}
];

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
    if (sortBy === 'latest') {
        return orderBy(posts, ['createdAt'], ['desc']);
    }
    if (sortBy === 'oldest') {
        return orderBy(posts, ['createdAt'], ['asc']);
    }
    if (sortBy === 'popular') {
        return orderBy(posts, ['view'], ['desc']);
    }
    return posts;
};

const SkeletonLoad = (
    <Grid container spacing={3} sx={{mt: 2}}>
        {[...Array(4)].map((_, index) => (
            <Grid item xs={12} md={3} key={index}>
                <Skeleton variant="rectangular" width="100%" sx={{height: 200, borderRadius: 2}}/>
                <Box sx={{display: 'flex', mt: 1.5}}>
                    <Skeleton variant="circular" sx={{width: 40, height: 40}}/>
                    <Skeleton variant="text" sx={{mx: 1, flexGrow: 1}}/>
                </Box>
            </Grid>
        ))}
    </Grid>
);

export default function BlogPosts() {
    const {themeStretch} = useSettings();
    // const dispatch = useDispatch();
    const [filters, setFilters] = useState('latest');
    // const { posts, hasMore, index, step } = useSelector((state) => state.blog);
    // const sortedPosts = applySort(posts, filters);
//   const onScroll = useCallback(() => dispatch(getMorePosts()), [dispatch]);

//   useEffect(() => {
//     dispatch(getPostsInitial(index, step));
//   }, [dispatch, index, step]);

    const handleChangeSort = (event) => {
        setFilters(event.target.value);
    };

    return (
        <Page title="Bài viết">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Bài viết"
                    links={[
                        // { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        // { name: 'Blog', href: PATH_DASHBOARD.blog.root },
                        {name: 'Danh sách bài viết'},
                    ]}
                    action={
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to={PATH_PAGE.blogNew}
                            startIcon={<Icon icon={plusFill}/>}
                        >
                            Thêm bài viết mới
                        </Button>
                    }
                />

                <Stack
                    mb={5}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <BlogPostsSearch/>
                    <BlogPostsSort
                        query={filters}
                        options={SORT_OPTIONS}
                        onSort={handleChangeSort}
                    />
                </Stack>

                {/* <InfiniteScroll
          next={onScroll}
          hasMore={hasMore}
          loader={SkeletonLoad}
          dataLength={posts.length}
          style={{ overflow: 'inherit' }}
        > */}
                {/*<Grid container spacing={3}>*/}
                {/*  {sortedPosts.map((post, index) => (*/}
                {/*    <BlogPostCard key={post.id} post={post} index={index} />*/}
                {/*  ))}*/}
                {/*  trung*/}
                {/*</Grid>*/}
                {/* </InfiniteScroll> */}
            </Container>
        </Page>
    );
}
