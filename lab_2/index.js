import { createServer } from "http"
import { routes } from "./routes.js"



const server = createServer(async (req, res)=>{    
    const {url} = req
    if(url in routes){
        await routes[url](req, res)
    }else{
        await routes["*"](req, res)
    }
})


server.listen(3000, ()=>{
    console.log("listening on http://localhost:3000");
})