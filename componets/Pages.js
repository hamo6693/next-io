//للتنقل بين الصفحات
import { Pagination } from '@material-ui/lab'
import { Box } from '@material-ui/core'
import { useRouter } from 'next/router'

//معامل عدد الصفحات والصفحة الحالية
export default function Pages({count, page = 1}) {
    const router = useRouter()
    //حدث تغير الصفحة
    const onChange = (e, page) => {
        /*شيفرة التنقل بين الصفحات */
        router.push({
            pathname: '/',
            query: {...router.query, page}
        })
        
       alert(page)
    }
    return (
        <Box display="flex" justifyContent="center" p={3}>
            <Pagination
                count={count}
                variant="outlined"
                color="primary"
                page={page}
                onChange={onChange}
            />
        </Box>
    )
}