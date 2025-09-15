import { Router } from "express";
import {createInvite,deleteInvite,
    changeUser,deleteUser,getAllUsers,getAllInvites} from "../controllers/admin.controller.js"

const router = Router()

router.route("/invite")
    .post(createInvite)
    .get(getAllInvites);
router.route("/invite/:inviteId").delete(deleteInvite)
router.route("/users/:user_id").patch(changeUser)
router.route("/users/:user_id").delete(deleteUser)
router.route("/users").get(getAllUsers)


export default router