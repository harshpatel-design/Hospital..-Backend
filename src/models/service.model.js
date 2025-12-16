import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    serviceName: { type: String, required: true },
    department: { type: String, required: true },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
