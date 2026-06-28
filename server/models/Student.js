import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String, trim: true },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    dob: { type: Date },
    gender: { type: String, trim: true },
    category: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    religion: { type: String, trim: true },
    aadhar: { type: String, trim: true, match: [/^\d{12}$/, "Invalid Aadhaar number"], },
    photo: { type: String, trim: true },

    programme: { type: String, trim: true, default: "B.Tech" },
    branch: { type: String, trim: true },
    semester: { type: String, trim: true },
    section: { type: String, trim: true },
    admissionYear: { type: String, trim: true },
    admissionDate: { type: String, trim: true },
    feeCategory: { type: String, trim: true },
    previousSchool: { type: String, trim: true },
    tcNumber: { type: String, trim: true },

    guardianName: { type: String, trim: true },
    guardianRelation: { type: String, trim: true },
    guardianPhone: { type: String, trim: true, match: [/^[6-9]\d{9}$/, "Invalid phone number"], },
    guardianEmail: { type: String, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, "Invalid email address"], },
    guardianOccupation: { type: String, trim: true },
    guardianIncome: { type: String, trim: true },
    motherName: { type: String, trim: true },
    motherPhone: { type: String, trim: true, match: [/^[6-9]\d{9}$/, "Invalid phone number"], },

    personalEmail: { type: String, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, "Invalid email address"] },
    phone: { type: String, trim: true, match: [/^[6-9]\d{9}$/, "Invalid phone number"], },
    permanentAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },

    hostelRequired: { type: String, trim: true },
    transportRequired: { type: String, trim: true },
    busRoute: { type: String, trim: true },
    scholarshipApplicable: { type: String, trim: true },
    scholarshipScheme: { type: String, trim: true },
    remarks: { type: String, trim: true },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Suspended",
        "Detained",
        "Alumni",
        "Dropout",
      ],
      default: "Active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

studentSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  next();
});

studentSchema.index({ branch: 1 });
studentSchema.index({ semester: 1 });
studentSchema.index({ status: 1 });
export default mongoose.model("Student", studentSchema);
