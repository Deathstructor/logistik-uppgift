import mongoose, { Document, Mongoose } from "mongoose";
import { ProductModel } from "./collection_data.js";
import { WarehouseModel } from "./collection_data.js";
import { EmployeeModel } from "./collection_data.js";
import { OrderModel } from "./collection_data.js";

let url = `mongodb+srv://chastainpaul:${Bun.env.MONGOOSE_PASSWORD}@logistikuppgift.1erd8t4.mongodb.net/LogistikDB?retryWrites=true&w=majority`;

const warehouseAmount = 10;
const employeeAmount = 20;
const orderAmount = Math.random() * 50;
const productAmount = 50;

let warehouseArr = [];
let employeeArr = [];
let productArr = [];

Run();
async function Run() {
    try {
        await mongoose.connect(url);
        console.log(`Successfully connected to ${mongoose.connection.name}`);

        if (await WarehouseModel.exists() == null) {
            for (let i = 0; i < warehouseAmount; i++) {
                warehouseArr[i] = await WarehouseModel.create({
                    name: `Warehouse ${i + 1}`,
                    id: i
                });
                // console.log(warehouseArr[i]);
            }
        }
        if (await EmployeeModel.exists() == null) {
            for (let i = 0; i < employeeAmount; i++) {
                employeeArr[i] = await EmployeeModel.create({
                    name: "PLACEHOLDER",
                    warehouseId: Math.floor(Math.random() * warehouseAmount),
                    job: "PLACEHOLDER",
                    availability: true
                });
                // console.log(employeeArr[i]);
            }
        }
        if (await ProductModel.exists() == null) {
            for (let i = 0; i < productAmount; i++) {
                productArr[i] = await ProductModel.create({
                    name: "PLACEHOLDER",
                    id: Math.floor(Math.random() * warehouseAmount),
                    stock: Math.floor(Math.random() * 50),
                    shelf: Math.floor(Math.random() * 100),
                    price: 1234,
                    weight: 50
                });
                // console.log(productArr[i]);
            }
        }
    } catch (error) {
        console.error(error);
    }
};