import mongoose, { Document, Mongoose } from "mongoose";
import { ProductModel } from "./collection_data.js";
import { WarehouseModel } from "./collection_data.js";
import { EmployeeModel } from "./collection_data.js";
import { OrderModel } from "./collection_data.js";
import { employeeNames } from "./data.json";
import { jobs } from "./data.json";
import { productNames } from "./data.json";
import { productPrices } from "./data.json";

let url = `mongodb+srv://chastainpaul:${Bun.env.MONGOOSE_PASSWORD}@logistikuppgift.1erd8t4.mongodb.net/LogistikDB?retryWrites=true&w=majority`;

const warehouseAmount = 10;
const employeeAmount = 20;
const orderAmount = Math.random() * 50;
const productAmount = productNames.length;

let warehouseArr = [];
let employeeArr = [];
let productArr = [];

function randomWeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

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
            }
        }
        if (await EmployeeModel.exists() == null) {
            for (let i = 0; i < employeeAmount; i++) {
                employeeArr[i] = await EmployeeModel.create({
                    name: employeeNames[Math.floor(Math.random() * employeeNames.length)],
                    warehouseId: Math.floor(Math.random() * warehouseAmount),
                    job: jobs[Math.floor(Math.random() * 2)],
                    availability: true
                });
            }
        }

        if (await ProductModel.exists() == null) {
            for (let i = 0; i < productAmount; i++) {
                productArr[i] = await ProductModel.create({
                    name: productNames[i],
                    id: Math.floor(Math.random() * warehouseAmount),
                    stock: Math.floor(Math.random() * 50),
                    shelf: Math.floor(Math.random() * 20),
                    price: productPrices[i],
                    weight: randomWeight(1000, 5000)
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
};