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

const days = { 
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

function randomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

Run();
async function Run() {
    try {
        mongoose.connect(url).
            then(() => {
                console.log(`Successfully connected to ${mongoose.connection.name}`)
            });

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
                        availability: Math.random() < 0.5,
                        startTime: `0${randomMinMax(7, 9)}:00`,
                        endTime: `${randomMinMax(15, 17)}:00`
                    };
                }
                await EmployeeModel.create({
                    name: employeeNames[i],
                    warehouseId: Math.floor(Math.random() * warehouseAmount),
                    job: jobs[Math.floor(Math.random() * 2)],
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
            .get('/', () => displayEmployees(""))
            .get('/available', () => displayAvailableEmployees(""))
            .group('/drivers', app => app
                .get('/', () => displayEmployees("Driver"))
                .get('/available', () => displayAvailableEmployees("Driver"))
                .get('/available/:day', ({ params: { day } }) => displayAvailableEmployees("Driver", day))
            )
            .group('/pickers', app => app
                .get('/', () => displayEmployees("Picker"))
                .get('/available', () => displayAvailableEmployees("Picker"))
                .get('/available/:day', ({ params: { day } }) => displayAvailableEmployees("Picker", day))
            )
        );

        app.listen(25565);
        console.log(`Running at http://${app.server?.hostname}:${app.server?.port}`);

    } catch (error) {
        console.error(error);
    }
};

async function displayEmployees(employeeType) {
    if (employeeType === "") {
        return (await EmployeeModel
            .find({})
            .exec())
            .map(e => {
                return {
                    name: e.name,
                    warehouseId: e.warehouseId,
                    job: e.job,
                    schedule: e.schedule
                }
            });
    } else {
        return (await EmployeeModel
            .find({})
            .exec())
            .filter(e => e.job == employeeType)
            .map(e => {
                return {
                    name: e.name,
                    warehouseId: e.warehouseId,
                    job: e.job,
                    schedule: e.schedule
                }
            });
    }

}

async function displayAvailableEmployees(employeeType, selectedDay) {
    if (employeeType === "") {
        return (await EmployeeModel
            .find({})
            .exec())
            .filter(e => e.schedule.availability)
            .map(e => {
                return {
                    name: e.name,
                    warehouseId: e.warehouseId,
                    job: e.job,
                    schedule: e.schedule
                }
            })
    } else {
        let allEmployees = (await EmployeeModel.find({}).exec());
        let okEmployees = [];

        selectedDay = selectedDay == "Today" ? days[new Date().getDay()] : selectedDay;
        
        if (selectedDay) {
            allEmployees.filter(w => w.schedule.forEach(d => {
                if (d.availability && d.day == selectedDay) {
                    okEmployees.push(w);
                }
            }));
        } else {
            okEmployees = allEmployees;
        }

        okEmployees = okEmployees.filter(w => w.job == employeeType)

        console.log(days[new Date().getDay()]);

        return okEmployees;
    };
}