const router = require("express").Router();

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");

const Users = require("../models/users.model");

// Register User from Signup Page
router.post("/register", async (req, res) => {
  try {
    let {
      name,
      emailaddress,
      password,
      passwordCheck
    } = req.body;
    // validate
    if (!name || !emailaddress || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    }
    const existingUser = await Users.findOne({ emailaddress: emailaddress });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "A user with this emailaddress already exists." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new Users({
      name,
      emailaddress,
      password: passwordHash,
      status:1,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { emailaddress, password } = req.body;
    // validate
    if (!emailaddress || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    const user = await Users.findOne({ emailaddress: emailaddress });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "No user with this emailaddress has been added." });
    } else {
      //Check user is Active/Inactive
      if (!user.status) {
        return res.status(400).json({ msg: "User is not active." });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if token is valid
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.json(false);
    }
    const user = await Users.findById(verified.id);
    if (!user) {
      return res.json(false);
    }
    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add User
router.post("/add", auth, async (req, res) => {
  try {
    let {
      name,
      emailaddress,
      password,
      passwordCheck,
      status,
      createdBy,
    } = req.body;
    // validate
    if (!name || !emailaddress || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please enter all fields!" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    }
    const existingUser = await Users.findOne({ emailaddress: emailaddress });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "A user with this emailaddress already exists." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new Users({
      name,
      emailaddress,
      password: passwordHash,
      status,
      createdBy,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get All Users
router.get("/", auth, async (req, res) => {
  Users.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get user  By Id
router.get("/:id", auth, async (req, res) => {
  Users.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.json('User deleted!')
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update User
router.post("/update/:id", auth, async (req, res) => {
  try {
    let {
      name,
      emailaddress,
      password,
      passwordCheck,
      status,
      createdBy,
    } = req.body;

    if (!name || !emailaddress || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please enter all fields!" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    }
    // const existingUser = await Users.find({ emailaddress: emailaddress, _id: {$ne :id } });
    // if (existingUser) {
    //   return res
    //     .status(400)
    //     .json({ msg: "A user with this emailaddress already exists." });
    // }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    
    Users.findById(req.params.id)
    .then(user => {
      user.name = name;
      user.emailaddress = emailaddress;
      user.status = status;
      user.password = passwordHash;
      user.updatedBy = createdBy;

      user.save()
        .then(() => res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;
