const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/verifytoken');


const Chefs = require('../models/chef-model');

//validation
const {regVal, loginVal} = require('../middleware/validation')



router.post('/register', async (req, res) => {
  const { error } = regVal(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //email exists?
  const emailExist = await Chefs.findOne({email: req.body.email});
  if(emailExist) return res.status(400).send('Email already exists');
  
  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const chef = new Chefs({
    _id: new mongoose.Types.ObjectId(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    location: req.body.location,
    profilepic: req.body.profilepic,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const newChef = await chef.save();
    // res.send(`Welcome, Chef, ${req.body.firstname} `);
    res.send({ chef: chef._id });
  } catch (err) {
    res.status(400).send(err);
  }
});



router.post('/login', async (req,res)=>{
  const { error } = loginVal(req.body);
  if(error) return res.status(400).send(error.details[0].message);
//email exists?
  const chef = await Chefs.findOne({email: req.body.email});
  if(!chef) return res.status(400).send('Email is invalid');

  //password correct?
const validpass = await bcrypt.compare(req.body.password, chef.password);
if(!validpass) return res.status(400).send('Invalid pass');

//Create and assign a token
const token = jwt.sign({_id: chef._id}, process.env.TOKEN_SECRET);
res.header('auth-token', token).send(token);


})


// router.post('/register', function(req, res, next) {
//   Chefs.find({ email: req.body.email })
//     .exec()
//     .then(exists => {
//       if (exists.length >= 1) {
//         return res.status(409).json({
//           message: 'User already exists.'
//         });
//       } else {
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           if (err) {
//             return res.status(500).json({
//               error: err
//             });
//           } else {
//             const chef = Chefs({
//               _id: new mongoose.Types.ObjectId(),
//               name: req.body.name,
//               location: req.body.location,
//               profilepic: req.body.profilepic,
//               email: req.body.email,
//               password: hash
//             });
//             chef
//               .save()
//               .then(result => {
//                 console.log(result);
//                 res.status(201).json({

//                   message: `Welcome, Chef, ${result.name}. Let's get cooking!`
//                 });
//               })
//               .catch(err => {
//                 res.status(500).json({
//                   error: err
//                 });
//               });
//           }
//         });
//       }
//     });
// });

// router.post('/login', (req, res, next) => {
//   Chefs.find({ email: req.body.email })
//     .exec()
//     .then(chef => {
//       if (chef.length < 1) {
//         res.status(401).json({
//           message: 'Authorization Failed.'
//         });
//       }
//       bcrypt.compare(req.body.password, chef[0].password, (err, result) => {
//         if (err) {
//           return res.status(401).json({
//             message: `Authorization Failed  `
//           });
//         }
//         if (result) {
//           const token = jwt.sign(
//             { email: chef[0].email, chefId: chef[0]._id },
//             'process.env.JWT_KEY',
//             { expiresIn: '5h' }
//           );
//           return res
//             .status(200)
//             .json({
//               message: `Authorization Successful ${chef[0].id} ${
//                 req.body.password
//               } -- ${chef[0].password}`,
//               token: token
//             });
//         }
//         res.status(401).json({ message: 'Authorization Failed' });
//       });
//     })
//     .catch(err => {
//       res.status(500).json({ error: err });
//     });
// });

//UPDATE chef account info
router.put('/:userId', checkAuth, function(req, res) {
  let chef = {};
  chef.name = req.body.name;
  chef.email = req.body.email;
  chef.location = req.body.location;

  let query = { _id: req.params.userId };

  Chefs.updateOne(query, chef, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.status(201).json({ chef });
    }
  });
});

//Delete chef account entirely
router.delete('/:userId', checkAuth, function(req, res) {
  let query = { _id: req.params.userId };

  Chefs.remove(query, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Sorry to see you go, Chef!');
    }
  });
});

// //Get all Chefs
// router.get('/',  checkAuth,  (req, res, next) => {
//   Chefs.find()
//     .select('name email location _id profilepic')
//     .exec()
//     .then(docs => {
//       const response = {
//         count: docs.length,
//         chefs: docs.map(doc => {
//           return {
//             name: doc.name,
//             email: doc.email,
//             location: doc.location,
//             _id: doc._id,
//             profilepic: doc.profilepic,
//             request: {
//               type: 'GET',
//               url: 'https://chefportfoliopt4.herokuapp.com/chefs/' + doc._id
//             }
//           };
//         })
//       };
//       if (docs.length >= 0) {
//         res.status(200).json(response);
//       } else {
//         res.status(200).json({ message: 'No entries found' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json(err);
//     });
//   // res.status(200).json({ message: 'GET all chefs' });
// });

// //Find Chef by ID
// router.get('/:chefId',  checkAuth, (req, res, next) => {
//   const id = req.params.chefId;
//   Chefs.findById(id)
//     .select('name email location _id')
//     .exec()
//     .then(doc => {
//       console.log('from database', doc);
//       if (doc) {
//         res.status(200).json({
//           chef: doc,
//           request: {
//             type: 'GET',
//             description: 'GET one Chef by _id',
//             url: 'https://chefportfoliopt4.herokuapp.com/chefs/' + doc._id
//           }
//         });
//       } else {
//         res.status(404).json({ message: 'No valid entry found for this id' });
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });

//UPDATE Chef using Patch
// router.patch("/:userId", (req, res, next) => {
//   id = req.params.userId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Chefs.update(
//     { _id: id },
//     {
//       $set: updateOps
//     }
//   )
//     .exec()
//     .then(res => {
//       console.log(result);
//       result.status(200).json({
//         message: "Account Updated, Chef."
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

//Delete Chef
// router.delete('/:userId', async (req, res, next) => {
//   console.log(req.params.userId);
//   const chef = req.params.userId;
//  Chefs.remove({_id: chef })
//  .exec().then(res=>{
//    res.status(200).on({ message:'Sorry to see you go, Chef!'})
//  }).catch(err=>{
//    res.status(500).json(err)
//  })
// });

// //Add new chef
// router.post('/', async function(req, res, next) {
//   const chefBody = req.body;
//   const chef = new Chefs({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     email: req.body.email,
//     location: req.body.location
//   });

//   try {
//     let newChef = await chef.save();
//     res.status(201).send({ response: `Welcome, Chef ${req.body.name}` });
//   } catch {
//     res.status(500).send(err);
//   }
// });

module.exports = router;
