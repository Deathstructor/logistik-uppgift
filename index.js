import mongoose, { Mongoose } from "mongoose";

import { Endpoints } from "./routes.js";
import { CreateWarehouse, CreateEmployee, CreateProduct, CreateOrder } from "./create_data.js";

let url = `mongodb+srv://chastainpaul:${Bun.env.MONGOOSE_PASSWORD}@logistikuppgift.1erd8t4.mongodb.net/LogistikDB?retryWrites=true&w=majority`;

Run();
async function Run() {
    try {
        mongoose.connect(url).then(() => {
            console.log(`Successfully connected to ${mongoose.connection.name}`)
        });

        CreateWarehouse();
        CreateEmployee();
        CreateProduct();
        CreateOrder();

        Endpoints();

    } catch (error) {
        console.error(error);
    }
};