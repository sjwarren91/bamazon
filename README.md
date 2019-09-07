# bamazon
An amazon-like store front application utilizing MySQL. The app will allow the user to order items and dynamically deplete stock from the database's inventory. The app also tracks product sales across the store's departments and then provides a summary of the highest grossing departments in the store. 

## Application levels
### Customer View
The customer view app will present all the items for sale that are currently stocked in the store. It will prompt the user for the ID of the item they are wanting to purchase, and the quantity they would like to purchase. The application will then show them the total cost of their order and update the store to reflect the depletion of stock. 

### Manager View
The manager view app lets the 'Manager' view all the products that are available for sale, as well as the remaining stock of the items. The Manager can choose to view all items with low stock, and then restock the items that require it. The manager view also has the ability to add brand new products to the store.

### Supervisor View
The supervisor view app tracks the total product sales across all the different departments, along with the profit or defecit each department is currently in. 