import { Elysia } from "elysia";
import { EmployeeModel } from "./collection_data.js";

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
            });
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

        okEmployees = okEmployees.filter(w => w.job == employeeType);

        return okEmployees;
    };
}