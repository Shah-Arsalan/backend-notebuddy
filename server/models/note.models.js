const mongoose = require("mongoose");
const { Schema } = mongoose;
const noteSchema = new Schema({
  title: String,
  content: String,
  timeCreated: String,
  time: String,
  backgroundColor: String,
  tag: String,
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
})

const note = mongoose.model('note', noteSchema);

module.exports = note;