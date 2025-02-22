import { createServer } from "http"
import { routes } from "./routes.js"



const server = createServer(async (req, res)=>{    
    const {url} = req
    const {pathname} = new URL(url, "http://localhost")
    if(pathname in routes){
        await routes[pathname](req, res)
    }else{
        await routes["*"](req, res)
    }
})


server.listen(3000, ()=>{
    console.log("listening on http://localhost:3000");
})