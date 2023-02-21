import { MainLayout } from "layouts";
import Post from "models/post";
import dbConnect from "utils/dbConnect";
import Head from "next/head";
import { useEffect,useState } from "react";
import { Router } from "next/router";
import usePost from "hooks/usePost";
import { Content,Tags,Vote } from "componets/question";
import {makeStyles, Box,Avatar,Typography,Divider,Button } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Editor } from "componets/inputs";
import moment from "moment";
import useAuth from "hooks/useAuth";




const useStyles = makeStyles((theme) => ({
    answersTitle: {
        background: theme.palette.background.title,
        padding: theme.spacing(2)
    },
    answerForm: {
        '& > *': {
            margin: theme.spacing(0, 0, 2, 0),
        },
        background: theme.palette.background.title
    }
}));



export default function index({params}){

    //في حالة عدم وجود سؤال
    useEffect(() => {
        if(!params?.id) Router.push("/404")
    },[params])

    //طلب بيانات السؤال
    const {data:post,loading,answer,vote} = usePost(params?.id)
    const {user} = useAuth()

    //const router = useRouter()

    return(
        <MainLayout title={post?.question?.title} loading={loading}>
            <Head>
                <title>{params?.question?.title}</title>
            </Head>
            <Box display="flex" m={2}>
                
                <Vote votesTotal={post?.votesTotal} vote={type => vote(post?.id,type)} />
                <Content html={post?.content} />           
            </Box>
            <QuestionFooter user={post?.user} tags={post?.tags} />
            <Answers items={post?.answers} vote={vote} />
            {
                user && <AnswerForm onSubmit={answer}/>
            }
        </MainLayout>
    )
}

//show user and tags
function QuestionFooter({user, tags}) {
    return (
        <Box display="flex" m={2}>
            <Box flexGrow={1} display="flex">
                <Avatar>{user?.name?.charAt(0)}</Avatar>
                <Box marginY={'auto'} marginX={1}>
                    {user?.name}
                </Box>
            </Box>
            <Box marginY={'auto'} display="flex">
                <Tags items={tags}/>
            </Box>
        </Box>
    )
}


function Answer({data: {id, content, user, createdAt,votesTotal},vote }) {
    return (
        <Box p={2}>
            <Box display="flex">
            <Vote votesTotal={votesTotal} vote={vote} />
                <Content html={content}/>
            </Box>
            <Box display="flex" marginTop={2}>
                <Avatar>{user.name.charAt(0)}</Avatar>
                <Box marginY={'auto'} marginX={1} flexGrow={1}>
                    {user.name}
                </Box>
                <Typography variant="caption" display="block" marginY={'auto'}>
                  {moment(createdAt).fromNow()}
                </Typography>
            </Box>
        </Box>
    )
}

function Answers({items,vote}) {
    const classes = useStyles()
    return (
        <>
            <Box className={classes.answersTitle}>
                <Typography variant='h6'>
                    <FormattedMessage id='post.answers'/>
                </Typography>
            </Box>
            <Divider/>
            {
                items?.map(answer => {
                    return <>
                        <Answer data={answer} vote={type => vote(answer.id,type)} />
                        <Divider/>
                    </>
                })
            }
        </>
    )
}

// Designing answers form
function AnswerForm({onSubmit}) {
    const classes = useStyles()
    const [content, setContent] = useState('')
    const handleSubmit = async () => {
        await onSubmit({content})
        setContent('')
    }
    return (
        <Box p={2} className={classes.answerForm}>
            <Box>
                <Editor onChange={setContent} content={content}/>
            </Box>
            <Button color="primary" variant="contained" onClick={handleSubmit}>
                <FormattedMessage id='btn.share'/>
            </Button>
        </Box>
    )
}



export async function getStaticPaths() {
    await dbConnect()

     //الاستعلام عن الاسئلة
    const items = await Post.find({parent:null}).exec()
    //استخراج المعرف الخال بكل سؤال
    const paths = items.map(e=>({params :{id:e.id.toString() }}))
    //اعادة النتيجة
    return{
        paths,
        //منح الخادمامكانية بناء صفحة خاصة للاسئلة الجديدة
        fallback:true
    }
}

//الاستعلام عن كل سؤال بشكل منفرد
export async function getStaticProps({params}) {
    await dbConnect()
    //استعلام عن السؤال
    let item = await Post.findById(params.id).exec()

    return {
        props: {
            params:JSON.parse(JSON.stringify(item))
        }
    }
}