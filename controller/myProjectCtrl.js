const Project = require("../models/myProjectModel");

const createProject = async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create project', error: error.message });
    }
};


const getOngoingProjects = async (req, res) => {
    try {
        const ongoingProjects = await Project.find({ status: 'ongoing' })
            .populate('employees.manpower', 'name mobile education age gender')
            .select('_id name jobCategory manpowerRequired employees');
        res.status(200).json(ongoingProjects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch ongoing projects', error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update project', error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.projectId);
        res.status(200).json(deletedProject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete project', error: error.message });
    }
};

module.exports = {
    createProject,
    getOngoingProjects,
    updateProject,
    deleteProject
};

