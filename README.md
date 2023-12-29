# Logistik Uppgift

I dett projekt har jag gjort ett väldigt grundläggande logistik system.
Jag har använt mig av Mongoose och MongoDB Atlas som databas och Elysia
för routes och endpoints. Koden har jag skrivit i JavaScript och data
såsom namn, priser osv har jag skrivit i JSON.



## URI:s

### Employees
http://localhost:25565/employees

http://localhost:25565/employees/drivers
http://localhost:25565/employees/drivers/:day - ex Monday (måste vara stor första bokstav)
http://localhost:25565/employees/drivers/:day/:time - ex 16 (skrivs endast som timme, ej minuter)

http://localhost:25565/employees/pickers
http://localhost:25565/employees/pickers/:day - ex Monday (måste vara stor första bokstav)
http://localhost:25565/employees/pickers/:day/:time - ex 16 (skrivs endast som timme, ej minuter)


### Products
http://localhost:25565/products
http://localhost:25565/products/in-stock
http://localhost:25565/products/:pName - ex RTX*3060_Ti (produktnamn med '*' istället för mellanslag)

Lista på alla produktnamn finns nedan.


### Orders
http://localhost:25565/orders
http://localhost:25565/orders/:status - ex picking

Lista på alla orderstatus finns nedan.


### Month Data
http://localhost:25565/month-data
http://localhost:25565/month-data/:month - ex June (måste vara stor första bokstav)



## Alla produktnamn
RTX 3050
RTX 3060
RTX 3060 Ti
RTX 3070
RTX 3070 Ti
RTX 3080
RTX 3080 Ti
RTX 3090
RTX 3090 Ti
RTX 4060
RTX 4060 Ti
RTX 4070
RTX 4070 Ti
RTX 4080
RTX 4090
RX 7600
RX 7700 XT
RX 7800 XT
RX 7900 XT
RX 7900 XTX
RX 6400
RX 6500 XT
RX 6600
RX 6600 XT
RX 6700
RX 6700 XT
RX 6750 XT
RX 6800
RX 6800 XT
RX 6900 XT
RX 6950 X


## Alla orderstatus
recieved
picking
picked
sending
delivered