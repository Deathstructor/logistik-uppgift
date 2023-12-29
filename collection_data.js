import mongoose, { Mongoose } from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    productId: Number,
    warehouseId: Number,
    stock: Number,
    shelf: Number,
    price: Number,
    weight: Number
});

const WarehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    id: Number
});

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
    assignedOrder: Number,
    schedule: [{
        day: {
            type: String,
            require: true,
            unique: true
        },
        startTime: String,
        endTime: String,
        startHour: Number,
        endHour: Number
    }]
});

const OrderSchema = new mongoose.Schema({
    products: [],
    orderNumber: Number,
    datePlaced: Date,
    totalPrice: Number,
    totalWeight: Number,
    assignedPicker: String,
    status: String
});

const MonthDataSchema = new mongoose.Schema({
    month: String,
    income: Number,
    mostExpensiveOrder: {}
});

export const ProductModel = mongoose.model("Product", ProductSchema);
export const WarehouseModel = mongoose.model("Warehouse", WarehouseSchema);
export const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
export const OrderModel = mongoose.model("Order", OrderSchema);
export const MonthDataModel = mongoose.model("MonthData", MonthDataSchema);