const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema(
    {
        mobile: {
            type: String,
        },
        otp: {
            type: String,
        },
        job_desc: {
            type: String,
        },
        city: {
            type: objectId,
            ref: "city"
        },
        siteLocation: {
            type: String,
        },
        employmentType: {
            type: String,
            enum: ["manpower", "agent"],
            default: "manpower",
        },
        category: {
            type: objectId,
            ref: "Category"
        },
        no_Of_opening: {
            type: String,
        },
        fullTime: {
            type: String,
            enum: ["fullTime", "partTime"],
            default: "fullTime",
        },
        miniSalary: {
            type: String,
        },
        maxSalary: {
            type: String,
        },
        workingDays: {
            type: Array,
        },
        workingHours: {
            type: String,
        },
        explainYourWork: {
            type: String,
        },
        date: {
            type: String,
        },
        apply: {
            type: String,
            default: "false"
        },
        manpowerId: {
            type: objectId,
            ref: "ManPower",
        },
        mobileVerified: {
            type: Boolean,
            default: false,
        },
        /////////////////////////////
        state: {
            type: String,
            ref: "state"
        },
        pinCode: {
            type: String
        },
        GST_Number: {
            type: String
        },
        registration_Number: {
            type: String
        },
        lati: {
            type: String
        },
        longi: {
            type: String
        },
        instantOrdirect: {
            type: String
        },
        otpSendToEmployer: {
            type: String
        },
        /////////////////////////////////
        name: {
            type: String,
            // required: true,
        },
        country: {
            type: String
        },
        landmark: {
            type: String
        },
        postOffice: {
            type: String
        },
        address: {
            type: String
        },
        village: {
            type: String
        },
        block: {
            type: String
        },
        education: [{ educationType: String, degree: String, yearOfPassing: String }],
        age: Number,
        gender: String,
        dob: Date,
        language: [String],
        bio: String,
        experience: Number,

        skills: [{ type: Schema.Types.ObjectId }],
        jobType: { type: String },
        serviceLocation: String,
        documents: [
            { documentName: String, documentNumber: String, documentImage: String },
        ],
        myProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
        active: {
            type: Boolean, default: true
        },
        aadharCard: {
            type: String,
        },
        panCard: {
            type: String,
        },
        otpSendToManpowerr: {
            type: String
        },
        otpSendToManpowerrVerified: {
            type: String,
            default: "false"
        },
        userType: {
            type: String,
            enum: ["manpower", "employer", "agent"],
            default: "employer"
        }
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
