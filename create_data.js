import { ProductModel, WarehouseModel, EmployeeModel, OrderModel, MonthDataModel} from "./collection_data.js";
import { employeeNames, productNames, productPrices, weekdays, orderStatus, months } from "./data.json";

const warehouseAmount = 10;
const employeeAmount = employeeNames.length;
const orderAmount = randomMinMax(5, 20);
const productAmount = productNames.length;

// Randomizers
function randomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
};

export async function CreateWarehouse() {
    await WarehouseModel.collection.drop();
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
                let startHour = randomMinMax(7, 9);
                let endHour = randomMinMax(15, 17);

                fullSchedule[dayIndex] = {
                    day: weekdays[dayIndex],
                    availability: true,
                    startTime: `0${startHour}:00`,
                    endTime: `${endHour}:00`,
                    startHour: startHour,
                    endHour: endHour
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
};

export async function CreateOrder() {
    await OrderModel.collection.drop();
    if (await OrderModel.exists() == null) {
        let allProducts = await ProductModel.find({}).exec();
        let allOrders = [];

        for (let i = 0; i < orderAmount; i++) {
            let productsInOrder = [];
            let selectedWarehouse = randomMinMax(0, warehouseAmount - 1);

            productsInOrder = allProducts.filter(p => {
                return p.warehouseId == selectedWarehouse;
            });

            if (randomMinMax(0, 5) > 0) {
                await EmployeeModel.findOneAndUpdate({ warehouseId: selectedWarehouse }, { assignedOrder: i })
            }

            allOrders.push({
                products: productsInOrder,
                orderNumber: i,
                datePlaced: randomDate(new Date(2023, 10, 1), new Date()),
                totalPrice: productsInOrder.map(obj => obj.price).reduce((sum, val) => sum + val, 0),
                totalWeight: productsInOrder.map(obj => obj.weight).reduce((sum, val) => sum + val, 0),
                status: orderStatus[randomMinMax(0, orderStatus.length)]
            });
        };

        await OrderModel.insertMany([ ...allOrders ]);
    };
};

export async function CreateMonthData() {
    await MonthDataModel.collection.drop();
    if (await MonthDataModel.exists() == null) {
        let allProducts = await ProductModel.find({}).exec();

        for (let i = 0; i < months.length; i++) {
            let productsInOrder = [];
            let selectedWarehouse = randomMinMax(0, warehouseAmount - 1);

            productsInOrder = allProducts.filter(p => {
                return p.warehouseId == selectedWarehouse;
            });

            let setOrderStatus = "";
            if (i === months.length - 1) {
                setOrderStatus = orderStatus[randomMinMax(0, orderStatus.length)];
            } else {
                setOrderStatus = orderStatus[4];
            };

            await MonthDataModel.create({
                month: months[i],
                income: randomMinMax(65000, 125000),
                mostExpensiveOrder: {
                    products: productsInOrder,
                    orderNumber: randomMinMax(1, 20),
                    datePlaced: new Date(2023, 0, randomMinMax(1, 29)),
                    totalPrice: productsInOrder.map(obj => obj.price).reduce((sum, val) => sum + val, 0),
                    totalWeight: productsInOrder.map(obj => obj.weight).reduce((sum, val) => sum + val, 0),
                    status: setOrderStatus
                }
            });
        };
    };
};