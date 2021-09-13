const express = require('express')

const { userById, allUsers, getUser, updateUser, deleteUser, userPhoto, updateUserRn } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');


const router = express.Router();


router.get("/users", requireSignin, allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser);
router.put("/rn/user/:userId", requireSignin, updateUserRn);
router.delete("/user/:userId", requireSignin, deleteUser);

//photo
router.get("/user/photo/:userId", userPhoto);


router.param("userId", userById);

module.exports = router;