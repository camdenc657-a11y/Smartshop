# smartshop-api

Small dependency-free Node API behind the Smart Groceries app.

    npm start        # http://localhost:3000
    npm test

- `GET /foods?q=` – search the food catalog
- `GET /list` – current grocery list
- `POST /list` `{ "name": "Avocado" }` – add a catalog or custom item
- `DELETE /list/:listId` – remove an item
