import dbConnect from "utils/dbConnect";
import Post from "models/post";

const handler = async (req,res) => {
    dbConnect()
    const {page,sort,tag} = req.query

    const where = tag?{tags:{$inc:[tag]}} : {}

    const {items,pages} = await Post.paginae({page,sort,where}) 
    res.status(201).json({
        data:{
            items,pages,page
        }
    })

}

export default handler