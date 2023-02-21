import { MainLayout } from 'layouts'
import {usePosts} from "hooks/usePost"
import QList from 'componets/QList'
import Pages from 'componets/Pages'
import { useRouter } from 'next/router'
import { ButtonGroup,Box,Button } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'


export default function Home() {
  const router = useRouter()
  //اختيار الصفحة للانتقال
  const page = router.query.page || 1
  const sort = router.query.sort || -1
  const {data} = usePosts({page,sort})

  //عدد الصفحات الموجودة في الطلب
return (
  <MainLayout>
    <Box display="flex" p={2} bgcolor={"#F4F7F9"}>
      <Box flexGrow={1}>
        <Filters/>
      </Box>
    </Box>
  <QList items={data?.items || []}/>
  <Pages count={data?.Pages} page={Number(page)}/>
  </MainLayout>
  )
}

function Filters() {
  const router = useRouter()
  //اختيار الصفحة للانتقال
  const navigate = (sort) => {
    router.push({
      pathname:"/",
      query:{...router.query,sort}
    })
  
}

  return (
    <ButtonGroup size='small'>
        <Button onClick={() => navigate(-1)}>
            <FormattedMessage id={'btn.newest'}/>
        </Button>
        <Button onClick={() => navigate(1)}>
            <FormattedMessage id={'btn.oldest'}/>
        </Button>
    </ButtonGroup>
    )
  }
 

