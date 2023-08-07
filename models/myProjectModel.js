const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['ongoing', 'completed'], // To indicate whether the project is ongoing or completed
            default: 'ongoing',
        },
        jobCategory: {
            type: String,
            required: true,
        },
        manpowerRequired: {
            type: Number,
            required: true,
        },
        employees: [{
            manpower: { type: Schema.Types.ObjectId, ref: 'ManPower' },
            workDescription: String,
            location: {
                state: String,
                city: String,
                country: String,
            },
            contact: String, // Employee's contact number
        }],
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Project', projectSchema);