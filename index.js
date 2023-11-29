import mongoose, { Mongoose } from "mongoose";

mongoose.connect(`mongodb+srv://chastainpaul:${Bun.env.MONGOOSE_PASSWORD}@logistikuppgift.1erd8t4.mongodb.net/?retryWrites=true&w=majority`);

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    id: Number,
    stock: Number,
    shelf: Number,
    price: Number,
    weight: Number
})

const WarehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    id: Number
});

const ScheduleSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        default: () => new Date.now()
    },
    endDate: Date
})

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    warehouseId: Number,
    job: {
        type: String,
        require: true
    },
    availability: {
        type: Boolean,
        require: true
    },
    schedule: ScheduleSchema
});

const OrderSchema = new mongoose.Schema({
    id: Number,
});

export const ProductModel = mongoose.model("Product", ProductSchema);
export const WarehouseModel = mongoose.model("Warehouse", WarehouseSchema);
export const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
export const OrderModel = mongoose.model("Order", OrderSchema);

const warehouseAmount = 10;
const workerAmount = 20;
const orderAmount = Math.random() * 100;

let warehouseArr = [];

Run();
async function Run() {
    for (let i = 0; i < warehouseAmount; i++) {
        warehouseArr[i] = new Warehouse({})
    }
};