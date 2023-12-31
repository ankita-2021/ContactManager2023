const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route      GET api/contacts
// @desc       Get all users contacts
// @access     Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      POST api/contacts
// @desc       Add new contacts
// @access     Private
router.post(
  "/",
  [auth, [check("name", "Name is requried").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route      PUT api/contacts/:id
// @desc       Update Contact
// @access     Private
router.put("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.body._id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      type: req.body.type,
    });
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      DELETE api/contacts/:id
// @desc       Delete Contact
// @access     Private
router.delete("/:id", async (req, res) => {
  try {
    const deleteContact = await Contact.findById(req.params.id).remove();
    res.status(200).json({ id: req.params.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
