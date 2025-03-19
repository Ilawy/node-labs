import { Router } from "express";
import { LeaveService } from "../services/leave.service.js";
import authMiddleware from "../middlewares/auth.js";

const leavesRouter = Router();

leavesRouter.post("/", authMiddleware, async (req, res) => {
  req.body.empId = req.user.id
  //^^
  const [error, result] = await LeaveService.create(req.body);
  if (error) {
    return res.status(422).json({ message: error.message });
  }
  res.json(result);
});


leavesRouter.get("/", authMiddleware, async (req, res)=>{
    const { skip = 0, limit = 10, ...rest } = req.query
    rest._id = req.user.id
    //^^
    const [error, result] = await LeaveService.getAll(skip, limit, rest)
    if(error){
        return res.status(500).json({ message: error.message })
    }
    return res.json(result)
})

leavesRouter.patch("/:id", authMiddleware, async (req, res) => {
  const leaveId = req.params.id
  const userId = req.user.id
  console.log(leaveId, userId);
  
  const { duration, status } = req.body;
  const [error, result] = await LeaveService.updateById(leaveId, userId, {
    duration,
    status,
  });
  
  if (error) return res.status(422).json({ message: error.message });
  res.json(result);
});



export default leavesRouter;
