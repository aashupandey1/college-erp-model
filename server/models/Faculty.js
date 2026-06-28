import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    name: { type: String, trim: true },

    id: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },

    photoPreview: { type: String, trim: true },
    dob: { type: String, trim: true },
    gender: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    category: { type: String, trim: true },

    phone: { type: String, trim: true },
    altPhone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    personalEmail: { type: String, trim: true, lowercase: true },

    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pin: { type: String, trim: true },

    aadhaar: { type: String, trim: true },
    pan: { type: String, trim: true },

    emergencyName: { type: String, trim: true },
    emergencyRel: { type: String, trim: true },
    emergencyPhone: { type: String, trim: true },

    dept: { type: String, trim: true },
    desig: { type: String, trim: true },
    empType: { type: String, trim: true },
    joining: { type: String, trim: true },
    qual: { type: String, trim: true },
    specialization: { type: String, trim: true },
    university: { type: String, trim: true },
    gradYear: { type: String, trim: true },
    phdTitle: { type: String, trim: true },
    phdYear: { type: String, trim: true },

    teachExp: { type: String, trim: true },
    indExp: { type: String, trim: true },
    publications: { type: String, trim: true },

    assignedSubjects: [{ type: String, trim: true }],
    lectureHrs: { type: String, trim: true },
    labHrs: { type: String, trim: true },
    tutorialHrs: { type: String, trim: true },

    isClassTeacher: { type: Boolean, default: false },
    isResearchGuide: { type: Boolean, default: false },
    isFYPGuide: { type: Boolean, default: false },
    isExamCoordinator: { type: Boolean, default: false },
    isAdmissionCoord: { type: Boolean, default: false },
    isNSSCoord: { type: Boolean, default: false },

    subjects: { type: Number, default: 0 },
    exp: { type: String, trim: true },
    status: { type: String, enum: ["Active", "Inactive", "On Leave"], default: "Active" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

facultySchema.pre("save", function (next) {
  this.name = [this.firstName, this.middleName, this.lastName].filter(Boolean).join(" ").trim();
  next();
});

export default mongoose.model("Faculty", facultySchema);
