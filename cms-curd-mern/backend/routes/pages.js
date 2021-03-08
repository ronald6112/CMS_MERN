const router = require("express").Router();

const auth = require("../middleware/auth");

const Pages = require("../models/pages.model");

//Get All Pages
router.route("/").get((req, res) => {
  Pages.find()
    .then((pages) => res.json(pages))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get Pages by Id
router.route("/:id").get((req, res) => {
  Pages.findById(req.params.id)
    .then((page) => res.json(page))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Add page
router.route("/add").post((req, res) => {
  let { title, content, keywords, createdBy } = req.body;

  const newPage = new Pages({
    title,
    content,
    keywords,
    createdBy,
  });

  newPage
    .save()
    .then(() => res.json("Page added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update Pages By Id
router.route("/update/:id").post((req, res) => {
  let { title, content, keywords, createdBy } = req.body;

  Pages.findById(req.body.id)
    .then((page) => {
      page.title = title;
      page.content = content;
      page.keywords = keywords;
      page.createdBy = createdBy;

      page
        .save()
        .then(() => res.json("Page updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//Delete Pages by Id
router.route("/:id").delete((req, res) => {
  Pages.findByIdAndDelete(req.params.id)
    .then(() => res.json("Page deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
