const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema(
    {
        employerName:{
            type:String
        },
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
        manpowerId: [{
            type: objectId,
            ref: "User",
            // default:""
        }],
        agentId:[{
            type: objectId,
            ref: "User", 
        }],
        
        mobileVerified: {
            type: Boolean,
            default: false,
        },
        status:{
            type:String,
            // enum:["hold","pending"]
            default:"pending"
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
            state: String,
            city: String,
            country: String,
            pinCode: Number,
            landmark: String,
            postOffice: String,
            address: String,
            village: String,
            block: String,
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
        },
        obj:{
            type:Array
        },
        orderId:{
            type:String
        },
        startTime:{
            type:String
        },
        endTime:{
            type:String
        },
        statusOfCompletion:{
            type:String
        },
        userVerification:{
            type:String,
            default:"false"
        },
        manpowerObj:[{

        }],
        agentName:{
            type:String
        },
        agentAddress:{
            type:String
        },
        agentServiceLocation:{
            type:String
        },
        agentBusinessName:{
            type:String
        },
        agentStrength:{
            type:String
        },
        uploadaadhar:{
            type:String
        },
        uploadPanCard:{
            type:String
        }

    },
    {
        timestamps: true,
    }
)

const UserModel = mongoose.model("User", UserSchema)
module.exports = UserModel
