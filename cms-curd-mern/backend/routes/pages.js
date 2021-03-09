const router = require("express").Router();

const auth = require("../middleware/auth");

const Pages = require("../models/pages.model");

//Get All Pages
router.get("/", auth, async (req, res) => {
  Pages.find()
    .then((pages) => res.json(pages))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get Pages by Id
router.get("/:id", auth, async (req, res) => {
  Pages.findById(req.params.id)
    .then((page) => res.json(page))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Delete Pages by Id
router.delete("/:id", auth, async (req, res) => {
  Pages.findByIdAndDelete(req.params.id)
    .then(() => res.json("Page deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Add page
router.post("/add", auth, async (req, res) => {
  let { title, content, keywords, createdBy } = req.body;

  const newPage = new Pages({
    title,
    content,
    keywords,
    createdBy,
  });

  // validate
  if (!title) {
    return res.status(400).json({ msg: "Please enter Title" });
  }

  newPage
    .save()
    .then(() => res.json("Page added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update Pages By Id
router.post("/update/:id", auth, async (req, res) => {
  let { title, content, keywords, createdBy } = req.body;

  // validate
  if (!title) {
    return res.status(400).json({ msg: "Please enter Title" });
  }
  
  Pages.findById(req.params.id)
    .then((page) => {
      page.title = title;
      page.content = content;
      page.keywords = keywords;
      page.updatedBy = createdBy;

      page
        .save()
        .then(() => res.json("Page updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
