const express = require('express')
const { extend } = require('lodash')
const router = express.Router()
const note = require('../models/note.models')
const user = require('../models/users.models')
const archive = require('../models/archive.models')
const app = express();
var jwt = require('jsonwebtoken');


const secret = process.env.AUTH_SECRET;

router.route('/')
  .post(async (req, res) => {
    try {
      const { title, content, timeCreated, time, backgroundColor, tag, tags } = req.body;
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, secret);
      const foundUser = await user.find({ email: decodedToken.userId })
      const refId = foundUser[0]._id.valueOf()
      const newNote = new note({ title, content, timeCreated, time, backgroundColor, tag, tags, user: refId })
      await newNote.save()
        .then((savedNote) => console.log("The new is ", newNote))
        .catch((err) => console.error(err))
      const CurrentNotes = await note.find({ user: refId });
      res.status(201).json({ notes: CurrentNotes })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }

  })
  .get(async (req, res) => {

    try {
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, secret);
      const foundUser = await user.find({ email: decodedToken.userId })
      const refId = foundUser[0]._id.valueOf()
      const currentUserNotes = await note.find({ user: refId });
      res.status(201).json({ notes: currentUserNotes })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }


  })

router.route('/:id')
  .post(async (req, res) => {
    try {
      const { id } = req.params;
      let currentNote = await note.findById(id);
      const updatedProduct = req.body;
      currentNote = extend(currentNote, updatedProduct);
      currentNote = await currentNote.save();
      const allNotes = await note.find({});
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, secret);
      const foundUser = await user.find({ email: decodedToken.userId })
      const refId = foundUser[0]._id.valueOf()
      const currentUserNotes = await note.find({ user: refId });
      res.status(201).json({ notes: currentUserNotes })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  })




router.route('/delete/:id')
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      let deletedNote = "";
      const isNoteInNotes = await note.findById(id);
      if (isNoteInNotes) {
        deletedNote = await note.deleteOne({ _id: id });
      }
      const isNoteinArchives = await archive.findById(id);
      if (isNoteinArchives) {
        deletedNote = await archive.deleteOne({ _id: id });
      }
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, secret);
      const foundUser = await user.find({ email: decodedToken.userId })
      const refId = foundUser[0]._id.valueOf()
      const currentUserNotes = await note.find({ user: refId });
      console.log("The current user notes are", currentUserNotes)
      const currentUserArchives = await archive.find({ user: refId })
      res.status(201).json({ notes: currentUserNotes, archives: currentUserArchives })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  })


router.route('/archive')
  .get(async (req, res) => {
    try {
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, secret);
      const foundUser = await user.find({ email: decodedToken.userId })
      const refId = foundUser[0]._id.valueOf()
      const currentUserArchives = await archive.find({ user: refId });
      res.status(201).json({ archives: currentUserArchives })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  })


router.route('/archive/:id')
  .post(async (req, res) => {
    try {
      const { id } = req.params;
      const currentNote = await note.findById(id);
      const { title, content, timeCreated, time, backgroundColor, tag, tags } = currentNote;
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, secret);
      const foundUser = await user.find({ email: decodedToken.userId })
      const refId = foundUser[0]._id.valueOf()
      const archiveNote = new archive({ title, content, timeCreated, time, backgroundColor, tag, tags, user: refId })
      await archiveNote.save()
        .then((savedNote) => console.log("The new is in archive", archiveNote))
        .catch((err) => console.error(err))
      const deletedNote = await note.deleteOne({ _id: id });
      const currentUserNotes = await note.find({ user: refId });
      const currentUserArchives = await archive.find({ user: refId })
      res.status(201).json({ notes: currentUserNotes, archives: currentUserArchives })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  })




router.route('/archive/restore/:id')
  .post(async (req, res) => {
    try {
      const { id } = req.params;
      const currentNote = await archive.findById(id);
      const { title, content, timeCreated, time, backgroundColor, tag, tags } = currentNote;
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, secret);
      const foundUser = await user.find({ email: decodedToken.userId })
      const refId = foundUser[0]._id.valueOf()
      const newNote = new note({ title, content, timeCreated, time, backgroundColor, tag, tags, user: refId })
      await newNote.save()
        .then((savedNote) => console.log("The new is in unarchive", newNote))
        .catch((err) => console.error(err))
      const deletedNote = await archive.deleteOne({ _id: id });
      const currentUserNotes = await note.find({ user: refId });
      const currentUserArchives = await archive.find({ user: refId })
      res.status(201).json({ notes: currentUserNotes, archives: currentUserArchives })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  })


module.exports = router;