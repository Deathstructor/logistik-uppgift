import { ProductModel, WarehouseModel, EmployeeModel, OrderModel } from "./collection_data.js";
import { employeeNames, productNames, productPrices, weekdays } from "./data.json";

const warehouseAmount = 10;
const employeeAmount = employeeNames.length;
const orderAmount = randomMinMax(5, 20);
const productAmount = productNames.length;

// Randomizers
function randomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export async function CreateWarehouse() {
    // WarehouseModel.collection.drop();
    if (await WarehouseModel.exists() == null) {
        for (let i = 0; i < warehouseAmount; i++) {
            await WarehouseModel.create({
                name: `Warehouse ${i + 1}`,
                id: i
            });
        }
    }
};

export async function CreateEmployee() {
    await EmployeeModel.collection.drop();
    if (await EmployeeModel.exists() == null) {
        let assignedWarehouse = [];

        for (let employeeIndex = 0; employeeIndex < employeeAmount; employeeIndex++) {
            let fullSchedule = [];

            for (let dayIndex = 0; dayIndex < weekdays.length; dayIndex++) {
                fullSchedule[dayIndex] = {
                    day: weekdays[dayIndex],
                    availability: Math.random() < 0.5,
                    startTime: `0${randomMinMax(7, 9)}:00`,
                    endTime: `${randomMinMax(15, 17)}:00`
                };
            }

            let warehouseNum = 0;
            let employeeJob = [];
            for (let j = 0; j < employeeAmount; j += 2) {
                assignedWarehouse[j] = warehouseNum;
                assignedWarehouse[j + 1] = warehouseNum;

                employeeJob[j] = "Picker";
                employeeJob[j + 1] = "Driver";

                warehouseNum++;
            }

            await EmployeeModel.create({
                name: employeeNames[employeeIndex],
                warehouseId: assignedWarehouse[employeeIndex],
                job: employeeJob[employeeIndex],
                schedule: fullSchedule
            });
        }
    }
};

export async function CreateProduct() {
    await ProductModel.collection.drop();
    if (await ProductModel.exists() == null) {
        for (let i = 0; i < productAmount; i++) {
            await ProductModel.create({
                name: productNames[i],
                productId: i,
                warehouseId: Math.floor(Math.random() * warehouseAmount),
                stock: Math.floor(Math.random() * 50),
                shelf: Math.floor(Math.random() * 20),
                price: productPrices[i],
                weight: randomMinMax(1000, 5000)
            });
        }
    }
}

export async function CreateOrder() {
    await OrderModel.collection.drop();
    if (await OrderModel.exists() == null) {
        let productsInOrder = [];

        for (let i = 0; i < orderAmount; i++) {
            (await WarehouseModel.find().exec()).forEach(async (w) => {
                (await ProductModel.find().exec()).forEach(async (p) => {
                    if (p.warehouseId === w.id) {
                        productsInOrder.push(p);
                    };
                });
            });

            if (!productsInOrder.length == 0) {
                await OrderModel.create({
                    products: productsInOrder,
                    orderNumber: i,
                    datePlaced: randomDate(new Date(2023, 10, 1), new Date()),
                    totalPrice: productsInOrder.map(obj => obj.price).reduce((sum, val) => sum + val, 0),
                    totalWeight: productsInOrder.map(obj => obj.weight).reduce((sum, val) => sum + val, 0)
                });
            }

            productsInOrder = [];
        };
    };
}