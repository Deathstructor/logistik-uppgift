import mongoose, { Mongoose } from "mongoose";
import { Elysia } from "elysia";

import { ProductModel, WarehouseModel, EmployeeModel, OrderModel } from "./collection_data.js";
import { employeeNames, jobs, productNames, productPrices, weekdays } from "./data.json";

let url = `mongodb+srv://chastainpaul:${Bun.env.MONGOOSE_PASSWORD}@logistikuppgift.1erd8t4.mongodb.net/LogistikDB?retryWrites=true&w=majority`;

const warehouseAmount = 10;
const employeeAmount = employeeNames.length;
const orderAmount = Math.random() * 50;
const productAmount = productNames.length;
const fullSchedule = [];

function randomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

Run();
async function Run() {
    try {
        await mongoose.connect(url);
        console.log(`Successfully connected to ${mongoose.connection.name}`);

        const app = new Elysia().get("/", () => "Hello");
        
        if (await WarehouseModel.exists() == null) {
            for (let i = 0; i < warehouseAmount; i++) {
                await WarehouseModel.create({
                    name: `Warehouse ${i + 1}`,
                    id: i
                });
            }
        }
        if (await EmployeeModel.exists() == null) {
            for (let i = 0; i < employeeAmount; i++) {
                for (let i = 0; i < weekdays.length; i++) {
                    fullSchedule[i] = {
                        day: weekdays[i],
                        startTime: `0${randomMinMax(7, 9)}:00`,
                        endTime: `${randomMinMax(15, 17)}:00`
                    };
                }
                await EmployeeModel.create({
                    name: employeeNames[i],
                    warehouseId: Math.floor(Math.random() * warehouseAmount),
                    job: jobs[Math.floor(Math.random() * 2)],
                    availability: true,
                    schedule: fullSchedule
                });
            }
        }
        if (await ProductModel.exists() == null) {
            for (let i = 0; i < productAmount; i++) {
                await ProductModel.create({
                    name: productNames[i],
                    id: Math.floor(Math.random() * warehouseAmount),
                    stock: Math.floor(Math.random() * 50),
                    shelf: Math.floor(Math.random() * 20),
                    price: productPrices[i],
                    weight: randomMinMax(1000, 5000)
                });
            }
        }
        


        app.group('/employees', app => app
            .get('/', displayEmployees)
        );
        
        app.listen(25565);
        console.log(`Running at http://${app.server?.hostname}:${app.server?.port}`);

    } catch (error) {
        console.error(error);
    }
};

async function displayEmployees() {
    return (await EmployeeModel.find({}).exec()).map(e => {
        return {
            name: e.name,
            warehouseId: e.warehouseId,
            job: e.job,
            availability: e.availability,
            schedule: e.schedule
        };
    });
}