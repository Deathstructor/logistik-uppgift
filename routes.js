import { Elysia } from "elysia";
import { EmployeeModel, OrderModel, ProductModel } from "./collection_data.js";

const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

export function Endpoints() {
    try {
        const app = new Elysia().get("/", () => "Hello");

        app.group('/employees', app => app
            .get('/', async () => displayEmployees(""))
            .group('/drivers', app => app
                .get('/', async () => displayEmployees("Driver"))
                .get('/available/:day', async ({ params: { day } }) => displayAvailableEmployees("Driver", day))
                .get('/available/:day/:time', async ({ params: { day, time } }) => displayAvailableEmployees("Driver", day, time))
            )
            .group('/pickers', app => app
                .get('/', async () => displayEmployees("Picker"))
                .get('/available/:day', async ({ params: { day } }) => displayAvailableEmployees("Picker", day))
                .get('/available/:day/:time', async ({ params: { day, time } }) => displayAvailableEmployees("Picker", day, time))
            )
        );

        app.group('/products', app => app
            .get('/', () => displayProducts(""))
            .get('/in-stock', () => displayProducts("inStock"))
            .get('/:pName', ({ params: { pName } }) => displayProducts(pName))
        );

        app.group('/orders', app => app
            .get('/', () => displayOrders(""))
            .get('/:status', ({ params: { status } }) => displayOrders(status))
        );

        app.listen(25565);
        console.log(`Running at http://${app.server?.hostname}:${app.server?.port}`);

    } catch (error) {
        console.error(error);
    }
}

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
                    schedule: e.schedule,
                    assignedOrder: e.assignedOrder
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
                    schedule: e.schedule,
                    assignedOrder: e.assignedOrder
                }
            });
    }

}

async function displayAvailableEmployees(employeeType, selectedDay, selectedTime) {
    if (selectedDay && !selectedTime) {
        let allEmployees = (await EmployeeModel.find({}).exec());
        let okEmployees = [];

        selectedDay = selectedDay == "Today" ? days[new Date().getDay()] : selectedDay;

        allEmployees.filter(w => w.schedule.forEach(s => {

            if (s.day == selectedDay) {
                okEmployees.push(w);
            }
        }));

        okEmployees = okEmployees.filter(w => w.job == employeeType);

        return okEmployees;

    } else if (selectedDay && selectedTime) {
        let allEmployees = (await EmployeeModel.find({}).exec());
        let okEmployees = [];

        selectedTime = selectedTime == "Now" ? new Date().getHours : selectedTime;

        allEmployees.filter(w => w.schedule.forEach(s => {
            if (s.day == selectedDay && s.startHour <= selectedTime && s.endHour >= selectedTime) {
                okEmployees.push(w);
            }
        }));

        okEmployees = okEmployees.filter(w => w.job == employeeType);

        return okEmployees;
    }
}

async function displayProducts(status) {
    if (status == "") {
        return (await ProductModel
            .find({})
            .exec())
            .map(p => {
                return {
                    name: p.name,
                    productId: p.productId,
                    warehouseId: p.warehouseId,
                    stock: p.stock,
                    shelf: p.shelf,
                    price: p.price,
                    weight: p.weight
                }
            });
    } else if (status == "inStock") {
        return (await ProductModel
            .find({})
            .exec())
            .filter(p => p.stock > 0)
            .map(p => {
                return {
                    name: p.name,
                    productId: p.productId,
                    warehouseId: p.warehouseId,
                    stock: p.stock,
                    shelf: p.shelf,
                    price: p.price,
                    weight: p.weight
                }
            })
    } else {
        console.log(status.replaceAll('_', ' '));
        let inputName = status.replaceAll('_', ' ');

        return (await ProductModel
            .find({})
            .exec())
            .filter(p => p.name == inputName)
            .map(p => {
                return {
                    name: p.name,
                    productId: p.productId,
                    warehouseId: p.warehouseId,
                    stock: p.stock,
                    shelf: p.shelf,
                    price: p.price,
                    weight: p.weight
                }
            })
    }
}

async function displayOrders(status) {
    if (status === ""){
        return (await OrderModel
            .find({})
            .exec())
            .map(o => {
                return {
                    products: o.products,
                    orderNumber: o.orderNumber,
                    datePlaced: o.datePlaced,
                    totalPrice: o.totalPrice,
                    totalWeight: o.totalWeight,
                    status: o.status
                }
            })
    } else {
        return (await OrderModel
            .find({})
            .exec())
            .filter(o => o.status == status)
            .map(o => {
                return {
                    products: o.products,
                    orderNumber: o.orderNumber,
                    datePlaced: o.datePlaced,
                    totalPrice: o.totalPrice,
                    totalWeight: o.totalWeight,
                    status: o.status
                }
            })
    }
}