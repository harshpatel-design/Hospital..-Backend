import Patient from "../models/patient.model.js";
import Charge from "../models/charge.model.js";
import ChargeMaster from "../models/chargeMaster.model.js";

/* =========================================================
   GET ALL PATIENTS
========================================================= */
export const getAllPatientService = async (page, limit, search, ordering) => {
  try {
    const skip = (page - 1) * limit;

    const searchFilter = {
      isActive: true,
      ...(search && {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { caseType: { $regex: search, $options: "i" } },
          { case: { $regex: search, $options: "i" } },
          { "address.city": { $regex: search, $options: "i" } },
        ],
      }),
    };

    const sortOrder = ordering?.startsWith("-") ? -1 : 1;
    const sortField = ordering?.replace("-", "") || "createdAt";

    const patients = await Patient.find(searchFilter)
      .select("-__v")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("opd.doctor", "firstName lastName email")
      .populate("ipd.doctor", "firstName lastName email")
      .populate("appointmentId")
      .populate("createdBy", "name email");

    const total = await Patient.countDocuments(searchFilter);

    return {
      message: "Patients fetched successfully",
      patients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("getAllPatientService error:", error);
    throw error;
  }
};

/* =========================================================
   GET PATIENT BY ID
========================================================= */
export const getAllPatientByIdService = async (id) => {
  try {
    const patient = await Patient.findById(id)
      .select("-__v")
      .populate("opd.doctor", "firstName lastName email")
      .populate("ipd.doctor", "firstName lastName email")
      .populate("appointmentId")
      .populate("createdBy", "name email")
      .lean();

    if (!patient) {
      throw new Error("Patient not found");
    }

    return {
      message: "Patient fetched successfully",
      patient,
    };
  } catch (error) {
    console.error("getAllPatientByIdService error:", error);
    throw error;
  }
};

/* =========================================================
   CREATE PATIENT
========================================================= */
export const createPatientService = async (data, file) => {
  try {
    if (file) data.profileImage = file.filename;
    if (data.opd && typeof data.opd === "string") data.opd = JSON.parse(data.opd);
    if (data.ipd && typeof data.ipd === "string") data.ipd = JSON.parse(data.ipd);
    if (data.emergency && typeof data.emergency === "string")
      data.emergency = JSON.parse(data.emergency);

    if (!data.caseType) throw new Error("caseType is required");
    if (!data.case) throw new Error("case (old/new) is required");
    
    const patient = await Patient.create(data);
    await createPatientCharge(patient);

    // 3️⃣ Populate response
    const populatedPatient = await Patient.findById(patient._id)
      .populate("opd.doctor", "firstName lastName email specialization department")
      .populate("ipd.doctor", "firstName lastName email specialization department")
      .populate("appointmentId")
      .populate("createdBy", "name email")
      .lean();

    return {
      message: "Patient created successfully",
      patient: populatedPatient,
    };
  } catch (error) {
    console.error("createPatientService error:", error);
    throw error;
  }
};

/* =========================================================
   UPDATE PATIENT
========================================================= */
export const updatePatientService = async (id, updates, file) => {
  try {
    if (file) updates.profileImage = file.filename;

    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const patient = await Patient.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const updatedPatient = await Patient.findById(id)
      .populate("opd.doctor", "firstName lastName email")
      .populate("ipd.doctor", "firstName lastName email")
      .populate("appointmentId")
      .populate("createdBy", "name email")
      .lean();

    return {
      message: "Patient updated successfully",
      patient: updatedPatient,
    };
  } catch (error) {
    console.error("updatePatientService error:", error);
    throw error;
  }
};

/* =========================================================
   DELETE PATIENT (SOFT DELETE)
========================================================= */
export const deletePatientService = async (id) => {
  try {
    const patient = await Patient.findById(id);
    if (!patient) throw new Error("Patient not found");

    patient.isActive = false;
    await patient.save();

    return { message: "Patient deleted successfully" };
  } catch (error) {
    console.error("deletePatientService error:", error);
    throw error;
  }
};

/* =========================================================
   CREATE PATIENT CHARGE (INTERNAL)
========================================================= */
const createPatientCharge = async (patient) => {
  try {
    let code;
    let doctorId = null;

    if (patient.caseType === "opd") {
      if (!patient.opd?.doctor)
        throw new Error("Doctor is required for OPD");
      doctorId = patient.opd.doctor;
      code = patient.case === "old" ? "OPD_OLD" : "OPD_NEW";
    }

    if (patient.caseType === "ipd") {
      if (!patient.ipd?.doctor)
        throw new Error("Doctor is required for IPD");
      doctorId = patient.ipd.doctor;
      code = patient.case === "old" ? "IPD_OLD" : "IPD_NEW";
    }

    if (patient.caseType === "emergency") {
      code = "EMERGENCY";
    }

    if (!code) return;

    const chargeMaster = await ChargeMaster.findOne({
      code,
      doctor: doctorId || null,
      isActive: true,
    });

    if (!chargeMaster) {
      throw new Error(`ChargeMaster not configured for ${code}`);
    }

    await Charge.create({
      patient: patient._id,
      doctor: doctorId,
      chargeMaster: chargeMaster._id,
      caseType: patient.caseType,
      baseAmount: chargeMaster.amount,
      totalAmount: chargeMaster.amount,
      balanceAmount: chargeMaster.amount,
      paymentStatus: "unpaid",
    });
  } catch (error) {
    console.error("createPatientCharge error:", error);
    throw error;
  }
};
