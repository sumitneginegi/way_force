const express = require("express");
const {
    createProject,
    getOngoingProjects,
    updateProject,
    deleteProject
} = require("../controller/myProjectCtrl");
const router = express.Router();

router.post('/', createProject);
router.get('/ongoing', getOngoingProjects);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);


module.exports = router;