# Bamazon

An Amazon-like storefront built entirely in the terminal. Node.js CLI app backed by MySQL, with three role-based modes covering the full retail loop — from customer checkout to department P&L.

---

## Tech Stack

- **Node.js** — CLI runtime
- **MySQL** — relational data store (products + departments)
- **mysql2** — parameterized queries, no string-interpolated SQL
- **inquirer** — interactive terminal prompts
- **dotenv** — credential management via `.env`
- **cli-table** — formatted table output in the terminal

---

## Install & Run

```bash
git clone https://github.com/jtledbet/bamazon.git
cd bamazon
npm install
cp .env.example .env   # add your MySQL credentials
```

### Database setup

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p bamazon_db < db/seeds.sql
```

### Start a mode

```bash
node bamazonCustomer.js     # browse and buy
node bamazonManager.js      # inventory management
node bamazonSupervisor.js   # department P&L
```

---

## Customer Mode

```
? What would you like to buy?
┌────┬───────────────────────┬──────────┬───────────┐
│ ID │ Product               │ Price    │ In Stock  │
├────┼───────────────────────┼──────────┼───────────┤
│ 1  │ Mechanical Keyboard   │ $89.99   │ 42        │
│ 2  │ USB-C Hub             │ $34.99   │ 118       │
│ 3  │ Noise-Cancel Headset  │ $149.00  │ 7         │
│ 4  │ Webcam 1080p          │ $59.95   │ 31        │
└────┴───────────────────────┴──────────┴───────────┘

? Select item ID: 3
? How many would you like? 2

✔ Order placed! Total: $298.00
```

---

## Manager Mode

```
? Manager options:
  ❯ View Low Inventory
    View All Products
    Add to Inventory
    Add New Product

-- Low Inventory (< 5 units) --
┌────┬────────────────────┬───────────┐
│ ID │ Product            │ Stock     │
├────┼────────────────────┼───────────┤
│ 7  │ HDMI Cable 6ft     │ 3         │
└────┴────────────────────┴───────────┘

? Restock product ID: 7
? Units to add: 50
✔ Inventory updated. New stock: 53
```

---

## Supervisor Mode

```
? Supervisor options:
  ❯ View Product Sales by Department
    Create New Department

┌──────────────────┬──────────────┬───────────┬────────────┬──────────┐
│ Department       │ Over Head    │ Sales     │ Total Cost │ Profit   │
├──────────────────┼──────────────┼───────────┼────────────┼──────────┤
│ Electronics      │ $10,000.00   │ $4,820.00 │ $10,000.00 │ -$5,180  │
│ Accessories      │ $3,500.00    │ $9,340.00 │ $3,500.00  │ $5,840   │
│ Peripherals      │ $5,000.00    │ $7,210.00 │ $5,000.00  │ $2,210   │
└──────────────────┴──────────────┴───────────┴────────────┴──────────┘
```

---

## What This Demonstrates

**SQL JOIN across normalized tables** — The supervisor view calculates profit by joining `products` (with `department_name` and `product_sales`) to `departments` (with `over_head_costs`), aggregating sales per department server-side before display. This is the most technically interesting piece — a single query does the group-by and arithmetic that drives the P&L table.

**Role-based CLI architecture** — Three entry points, each with its own prompt loop and permission scope. No shared state between roles; each file is self-contained.

**Parameterized SQL** — Every query uses `?` placeholders via `mysql2`. No template-string SQL anywhere in the codebase.

**Inventory guard** — Customer purchases check stock before committing the UPDATE. Insufficient stock is caught and reported without modifying the database.

**Environment variable discipline** — Credentials never appear in source. `.env.example` ships with the repo; `.env` is gitignored.
