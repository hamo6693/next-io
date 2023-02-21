//تحويل البيانات
import { serialize } from "cookie"

const cookie = (res,name,value,options = {}) =>{
    const stringValue = typeof value === 'object' ? `j:${JSON.stringify(value)}`:String(value)
//بالمفتاح نحدد المدة او العمل
    if('maxAge' in options) {
        options.expires = new Date(Date.now() + options.maxAge)
        options.maxAge /= 1000
    }
    options.path = options?.path || "/";
//تعيين الكوكي    
    res.setHeader('set-cookie',serialize(name,stringValue,options))

}
//اضافة الطبقة الى كائن الاستجابة
const cookies = handler => (req,res) => {
    res.cookie = (name,value,options) => cookie(res,name,value,options)
    return handler(req,res)
}
export default cookies;