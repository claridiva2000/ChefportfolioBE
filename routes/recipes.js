const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Chefs = require('../models/chef-model');
const Recipes = require('../models/recipe-model');
//Get all Chefs
router.get('/', (req, res, next) => {
  Chefs.find()
    .select('name email location _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        chefs: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            location: doc.location,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'https://chefportfoliopt4.herokuapp.com/chefs/' + doc._id
            }
          };
        })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(200).json({ message: 'no entries found' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
  // res.status(200).json({ message: 'GET all chefs' });
});

//Find Chef by ID
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  Chefs.findById(id)
    .select('name email location _id')
    .exec()
    .then(doc => {
      console.log('from database', doc);
      if (doc) {
        res.status(200).json({
          chef: doc,
          request: {
            type: 'GET',
            description: 'GET one Chef by _id',
            url: 'https://chefportfoliopt4.herokuapp.com/chefs/' + doc._id
          }
        });
      } else {
        res.status(404).json({ message: 'no valid entry found for this id' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//Add new chef
router.post('/', async function(req, res, next) {
  const chefBody = req.body;
  const chef = new Chefs({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    location: req.body.location
  });

  try {
    let newChef = await chef.save();
    res.status(201).send({ response: `Welcome, Chef ${req.body.name}` });
  } catch {
    res.status(500).send(err);
  }
});

module.exports = router;
