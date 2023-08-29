const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin/postVerification');

// Route to get total employer and manpower
router.get('/get/viewInShortAdmin', userController.viewInShortAdmin)
router.put('/put/verifyPostAdmin/:orderId', userController.verifyPostAdmin)
router.put('/put/verifyUserVerificationAdmin/:id', userController.verifyUserVerificationAdmin)
router.get('/get/getALlUserVerificationAdmin', userController.getALlUserVerificationAdmin)

module.exports = router
