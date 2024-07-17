# Riziki - The All-Inclusive POS System

## Description
Riziki is an all-inclusive Point of Sale (POS) system designed to streamline the management of product inventories, sales, and profits. This system aims to simplify the process of adding, editing, and deleting products by name, category, and batch, as well as making purchases and sales. It offers comprehensive record-keeping of sales and profits over different periods, providing users with valuable insights into their business performance.

## Project Setup/Installation Instructions

### Dependencies
To run this project, you will need to have the following installed:

- Node.js
- MongoDB
- npm (Node Package Manager)
- Git

### Installation Steps

1. Clone the Repository:

   ```bash
   git clone https://github.com/yourusername/riziki-pos.git
   cd riziki-pos
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

3. Set Up Environment Variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   MONGODB_URI=<your_mongodb_uri>
   PORT=3000
   ```

4. Run the Application:

   ```bash
   npm start
   ```

## Usage Instructions

### How to Run
To start the application, use the following command:

```bash
npm start
```

### Examples

#### Adding a Product
To add a new product, send a POST request to `/api/products` with the following JSON body:

```json
{
    "name": "Product Name",
    "category": "Category Name",
    "unitSize": 1,
    "pricePerKg": 10
}
```

#### Making a Sale
To record a sale, send a POST request to `/api/sales` with the following JSON body:

```json
{
    "username": "user1",
    "name": "Product Name",
    "category": "Category Name",
    "quantity": 5,
    "sellingPrice": 12,
    "buyer": "Customer Name",
    "saleDate": "2024-07-03T00:00:00.000Z"
}
```

### Input/Output

#### Input
- Product Information: Name, category, unit size, price per kg.
- Sale Information: Username, product name, category, quantity, selling price, buyer, sale date.

#### Output
- Success message with details of the recorded product or sale.
- Error message if the operation fails.

## Project Structure

```bash
riziki-pos/
├── models/
│   ├── Batch.js
│   ├── Inventory.js
│   ├── Sale.js
│   ├── User.js
├── routes/
│   ├── batchRoutes.js
│   ├── inventoryRoutes.js
│   ├── saleRoutes.js
│   ├── userRoutes.js
├── controllers/
│   ├── batchController.js
│   ├── inventoryController.js
│   ├── saleController.js
│   ├── userController.js
├── .env
├── app.js
├── package.json
└── README.md
```

### Key Files
- `models/`: Contains Mongoose schemas for Batch, Inventory, Sale, and User.
- `routes/`: Defines API endpoints for batches, inventory, sales, and users.
- `controllers/`: Contains the logic for handling requests to the API endpoints.
- `app.js`: Main application file that sets up the Express server.
- `package.json`: Lists dependencies and scripts for the project.
- `.env`: Environment variables for configuration.

## Additional Sections

### Project Status
The project is currently in progress.

### Known Issues
- Insufficient stock error handling needs improvement.
- Optimization needed for batch processing.

### Acknowledgements
This project utilizes several external libraries and resources:

- Express
- Mongoose
- Dotenv

### License
This project is licensed under the MIT License.

### Contact Information
For questions or feedback, please open an issue on the GitHub repository or contact us at support@riziki-pos.com.

This README provides a comprehensive overview of the Riziki POS system, covering essential aspects from setup to usage, ensuring that users can easily understand and utilize the system.