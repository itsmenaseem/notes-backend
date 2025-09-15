import { Router } from "express";

import {createNote,getAllNotes,
    getNote,updateNote,deleteNote } from "../controllers/note.controller.js"

const router = Router()

router.route("/")
    .post(createNote)
    .get(getAllNotes);

router.route("/my").get(getNote)
router.route("/:noteId").patch(updateNote)
router.route("/:noteId").delete(deleteNote);

export default router