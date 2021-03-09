const mongoose = require("mongoose");

const pagesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    keywords: { type: Array },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = Pages = mongoose.model("pages", pagesSchema);
