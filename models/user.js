const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema(
    {
        employerName: String,
        mobile: String,
        email: String,
        otp: String,
        job_desc: String,
        city: {
            type: mongoose.Schema.Types.String,
            ref: 'city',
        },
        siteLocation: String,
        employmentType: {
            type: String,
            enum: ["manpower", "agent"],
            default: "manpower",
        },
        // category: String,
        category: {
            type: mongoose.Schema.Types.String,  // Ensure that the type is String, as you mentioned it's stored as a string
            ref: 'Category',  // Make sure it references the 'Category' model
          },
        no_Of_opening: String,
        fullTime: {
            type: String,
            enum: ["fullTime", "partTime"],
            default: "fullTime",
        },
        miniSalary:String,
        maxSalary:String,
        workingDays:Array,
        workingHours:String,
        explainYourWork:String,
        radius:String,
        date:String,
        apply: {
            type: String,
            default: "false"
        },
        statusOfApply:{type:String,default:"false"},
        manpowerId: [{
            type: objectId,
            ref: "User",
            // default:""
        }],
        agentId: [{
            type: objectId,
            ref: "User",
        }],

        mobileVerified: {
            type: String,
            default: "false",
        },
        status: {
            type: String,
            // enum:["hold","pending"]
            default: "pending"
        },
        /////////////////////////////
        state: {
        type: mongoose.Schema.Types.String, 
        ref: 'state',  
      },
        pinCode: String,
        GST_Number: String,
        registration_Number: String,
        lati: String,
        longi: String,
        current_lati: String,
        current_longi: String,
        current_location:String,
        instantOrdirect: String,
        otpSendToEmployer: String,

        /////////////////////////////////

        manpowerName: String,
        country: String,
        landmark: String,
        postOffice: String,
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
        village: String,
        block: String,
        education: [{ educationType: String, degree: String, yearOfPassing: String }],
        age: Number,
        gender: String,
        dob: Date,
        language: [String],
        bio: String,
        experience: Number,
        // skills: [{ type: Schema.Types.ObjectId }],
        skills:[{type:String}],
        jobType: { type: String },
        serviceLocation: {lati:Number, longi:Number},
        documents: [
            { documentName: String, documentNumber: String, documentImage: String },
        ],
        myProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
        active: {
            type: String, default: "true"
        },
        aadharCard: String,
        panCard: String,
        otpSendToManpowerr: String,
        otpSendToManpowerrVerified: {
            type: String,
            default: "false"
        },
        // userType: {
        //     type: String,
        //     enum: ["manpower", "employer", "agent","admin"],
        //     default: "employer"
        // },
        userType:String,
        obj: Array,
        orderId: String,
        startTime: String,
        endTime: String,
        statusOfCompletion: [],
        userVerification: {
            type: String,
            default: "false"
        },
        manpowerObj: [{

        }],
        agentName: String,
        agentAddress: String,
        agentServiceLocation: {lati:Number, longi:Number},
        agentBusinessName: String,
        agentStrength: String,
        uploadaadhar: String,
        uploadPanCard: String,
        AdminName: String,
        SubAdminName:String,
        password: String,
        profile: String,
        averageRating: {
            type: Number,
            default:0
        },
        totalRating: {
            type: Number,
            default:0
        },
        wallet: {
            type: Number,
            default: 0
          },
       token:{
            type:String
          },
       totalPayment:Number,
       paymentStatus:{
            type:String,
            default:"false"
          },
          main_Address:{
            type:String
          },
          about:{
            type:String
          }

    },
    {
        timestamps: true,
    }
)

const UserModel = mongoose.model("User", UserSchema)
module.exports = UserModel
