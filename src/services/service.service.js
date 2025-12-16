import Service from "../models/service.model.js";
import ServiceName from "../models/serviceName.model.js";
import Department from "../models/department.model.js";
import { createServiceSchema, updateServiceSchema } from "../validation/service.validation.js";

/* =====================================================
   GET ALL SERVICES (Search + Pagination + Sorting)
===================================================== */
export const getAllServicesService = async (page, limit, search, ordering) => {
    const skip = (page - 1) * limit;

    let searchFilter = { isActive: true };

    if (search) {
        searchFilter.$or = [
            { serviceName: { $regex: search, $options: "i" } },
            { department: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const sortField = ordering.startsWith("-") ? ordering.substring(1) : ordering;
    const sortOrder = ordering.startsWith("-") ? -1 : 1;

    const services = await Service.find(searchFilter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Service.countDocuments(searchFilter);

    return {
        message: "Services fetched successfully",
        services,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

/* =====================================================
   GET SERVICE BY ID
===================================================== */
export const getServiceByIdService = async (id) => {
    const service = await Service.findById(id).lean();
    if (!service) throw new Error("Service not found");

    return {
        message: "Service fetched successfully",
        service,
    };
};

/* =====================================================
   CREATE SERVICE  (STRING BASED)
===================================================== */
export const createServiceService = async (data) => {
    const { error } = createServiceSchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    const { serviceName, department, price, description } = data;

    // Validate service name exists
    const serviceNameDoc = await ServiceName.findOne({ name: serviceName.toLowerCase() });
    if (!serviceNameDoc) throw new Error("Invalid service name");

    // Validate department exists
    const departmentDoc = await Department.findOne({ name: department.toLowerCase() });
    if (!departmentDoc) throw new Error("Invalid department");

    // Create service
    const service = await Service.create({
        serviceName,
        department,
        price,
        description,
        isActive: true,
    });

    return {
        message: "Service created successfully",
        service,
    };
};

/* =====================================================
   UPDATE SERVICE (STRING BASED)
===================================================== */
export const updateServiceService = async (id, updates) => {
    const { error } = updateServiceSchema.validate(updates);
    if (error) throw new Error(error.details[0].message);

    const service = await Service.findById(id);
    if (!service) throw new Error("Service not found");

    // Validate serviceName if provided
    if (updates.serviceName) {
        const exists = await ServiceName.findOne({ name: updates.serviceName.toLowerCase() });
        if (!exists) throw new Error("Invalid service name");
    }

    // Validate department if provided
    if (updates.department) {
        const exists = await Department.findOne({ name: updates.department.toLowerCase() });
        if (!exists) throw new Error("Invalid department");
    }

    Object.assign(service, updates);
    await service.save();

    return {
        message: "Service updated successfully",
        service,
    };
};

/* =====================================================
   SOFT DELETE SERVICE
===================================================== */
export const deleteServiceService = async (id) => {
    const service = await Service.findById(id);
    if (!service) throw new Error("Service not found");

    service.isActive = false;
    await service.save();

    return { message: "Service deleted successfully" };
};
