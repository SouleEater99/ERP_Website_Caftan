# 🗄️ ERP Website Database Schema

This document contains the complete database structure for the ERP Website project. All tables, columns, data types, and constraints are documented below.

## 🎯 **Database Tables and Their Purposes**

Your database schema is designed to support an Enterprise Resource Planning (ERP) system, specifically tailored for a production management system like "Caftan Talia." Each table plays a crucial role in managing different aspects of the business, from production and inventory to human resources and financial tracking.

Here's a breakdown:

### 👥 **users Table**
- **Purpose**: Stores information about all users who can access the system. This table is central to authentication and authorization.
- **Key Columns**: `id` (unique identifier, likely linked to Supabase Auth), `email`, `name`, `role` (e.g., 'worker', 'supervisor', 'admin'), `worker_id`.
- **Role**: Manages user accounts, defines their access levels (roles), and links them to specific worker data if applicable. Policies ensure users can read their own data, and only admins can manage other users.

### 📝 **work_logs Table**
- **Purpose**: Records the daily work activities performed by individual workers.
- **Key Columns**: `id`, `worker_id` (links to users), `worker_name`, `product`, `product_id`, `task`, `quantity`, `completed` (boolean), `notes`, `approved` (boolean), `approver_notes`, `approved_at`, `approver_id`.
- **Role**: Tracks production output, worker productivity, and tasks completed. It's essential for calculating worker earnings and monitoring production progress. The approval system ensures quality control and proper validation of completed work. Policies allow workers to log and read their own entries, while supervisors/admins can view all and approve completed tasks.

### 🏷️ **products Table**
- **Purpose**: Stores a catalog of all products manufactured or managed by the system.
- **Key Columns**: `id`, `code` (unique product code), `name_ar` (Arabic name), `name_en` (English name), `category`, `icon`, `active`.
- **Role**: Provides a master list of products, used across various modules like work_logs and bom to identify what is being produced.

### ✅ **tasks Table**
- **Purpose**: Defines the different types of production tasks or stages involved in manufacturing.
- **Key Columns**: `id`, `code` (unique task code), `name_ar`, `name_en`, `description_ar`, `description_en`, `icon`, `color_gradient`, `active`.
- **Role**: Standardizes the tasks that workers can log, ensuring consistency in reporting and calculations.

### 📋 **bom (Bill of Materials) Table**
- **Purpose**: Defines the raw materials and quantities required to produce each product.
- **Key Columns**: `id`, `product` (name of the product), `material` (name of the material), `qty_per_unit` (quantity of material per unit of product), `unit`, `waste_percent`, `deduct_at_stage`.
- **Role**: Crucial for inventory management (deducting materials when products are made) and cost accounting. It ensures that the correct amount of material is allocated for each production unit.

### 📦 **stock Table**
- **Purpose**: Tracks the current inventory levels of all raw materials and components.
- **Key Columns**: `id`, `material` (unique material name), `unit`, `current_stock`, `reorder_threshold`, `last_updated`.
- **Role**: Manages inventory, provides real-time stock levels, and triggers alerts when materials need to be reordered. It's vital for preventing production delays due to material shortages.

### 🔄 **stock_movements Table**
- **Purpose**: Records every incoming and outgoing movement of stock materials.
- **Key Columns**: `id`, `stock_id` (links to stock), `type` ('in' or 'out'), `quantity`, `note`, `created_at`.
- **Role**: Provides a detailed audit trail of all inventory changes, allowing for accurate tracking of material consumption and replenishment.

### 💰 **rates Table**
- **Purpose**: Stores the payment rates for specific tasks performed on specific products.
- **Key Columns**: `id`, `product`, `task`, `rate_per_unit`.
- **Role**: Used to calculate worker earnings based on the quantity of tasks completed, forming the basis for payroll calculations.

###  **payroll Table**
- **Purpose**: Manages and records payroll entries for workers over specific periods.
- **Key Columns**: `id`, `worker_id` (links to users), `worker_name`, `period_start`, `period_end`, `total_earnings`, `paid_status` (boolean).
- **Role**: Central to the financial aspect of HR, it tracks how much each worker is owed and whether they have been paid for a given period.

###  **production_stats Table**
- **Purpose**: Stores aggregated daily or periodic statistics related to overall production performance.
- **Key Columns**: `id`, `date`, `completed_tasks`, `pending_tasks`, `revenue`, `efficiency_rate`, `active_workers`.
- **Role**: Provides high-level insights into the factory's performance, useful for management dashboards and reports to track trends and overall productivity.

###  **activities Table**
- **Purpose**: Logs various actions and events occurring within the system, providing an activity feed or audit log.
- **Key Columns**: `id`, `worker_id` (optional, links to users), `worker_name`, `action_type`, `description`, `product_id` (optional, links to products), `status`, `avatar`, `created_at`.
- **Role**: Offers transparency and traceability of operations, showing who did what and when. It's useful for monitoring, debugging, and providing a chronological overview of system events.

### 📊 **material_usage_stats Table**
- **Purpose**: Stores aggregated statistics on material consumption over specific periods.
- **Key Columns**: `id`, `material_id` (links to stock), `material_name`, `usage_amount`, `usage_percentage`, `period_start`, `period_end`.
- **Role**: Helps in analyzing material consumption patterns, identifying waste, and optimizing procurement.

### 🏢 **locations Table**
- **Purpose**: Stores information about different physical locations or production facilities.
- **Key Columns**: `id`, `name`, `address`, `city`, `country`, `phone`, `email`, `status` ('active', 'inactive'), `worker_count`.
- **Role**: Manages multi-site operations, allowing the system to track resources and activities across different physical locations.

**In summary, these tables collectively form a comprehensive data model for managing a production-oriented business, covering everything from raw materials and production processes to human resources and financial reporting.**

---

## 📊 **Table Overview**

| Table | Purpose | Records |
|-------|---------|---------|
| `activities` | User activity tracking | - |
| `bom` | Bill of Materials | - |
| `locations` | Company locations | - |
| `material_usage_stats` | Material consumption statistics | - |
| `payroll` | Worker payroll records | - |
| `payroll_periods` | Payroll time periods | - |
| `production_stats` | Production metrics | - |
| `products` | Product catalog | - |
| `rates` | Task pricing rates | - |
| `stock` | Inventory management | - |
| `stock_movements` | Stock transaction history | - |
| `tasks` | Available work tasks | - |
| `users` | User accounts | - |

---

## 🔍 **Detailed Table Schemas**

### 📝 **activities**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `worker_id` | `uuid` | YES | `null` | - | Worker reference |
| `worker_name` | `text` | NO | `null` | - | Worker display name |
| `action_type` | `text` | NO | `null` | - | Type of activity |
| `description` | `text` | NO | `null` | - | Activity description |
| `product_id` | `uuid` | YES | `null` | - | Related product |
| `status` | `text` | YES | `'completed'` | - | Activity status |
| `avatar` | `text` | YES | `null` | - | Worker avatar URL |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |

### 📋 **bom** (Bill of Materials)
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `product` | `text` | NO | `null` | - | Product name |
| `material` | `text` | NO | `null` | - | Material name |
| `qty_per_unit` | `numeric` | NO | `null` | - | Quantity per unit |
| `unit` | `text` | NO | `null` | - | Unit of measurement |
| `waste_percent` | `numeric` | YES | `0` | - | Waste percentage |
| `deduct_at_stage` | `text` | NO | `null` | - | Stage for deduction |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |

### 🏢 **locations**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `name` | `text` | NO | `null` | - | Location name |
| `address` | `text` | NO | `null` | - | Street address |
| `city` | `text` | NO | `null` | - | City name |
| `country` | `text` | NO | `'UAE'` | - | Country (default: UAE) |
| `phone` | `text` | YES | `null` | - | Phone number |
| `email` | `text` | YES | `null` | - | Email address |
| `status` | `text` | NO | `'active'` | - | Location status |
| `worker_count` | `integer` | YES | `0` | - | Number of workers |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |
| `updated_at` | `timestamp with time zone` | YES | `now()` | - | Last update timestamp |

### 📊 **material_usage_stats**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `material_id` | `uuid` | YES | `null` | - | Material reference |
| `material_name` | `text` | NO | `null` | - | Material name |
| `usage_amount` | `numeric` | NO | `null` | - | Amount used |
| `usage_percentage` | `numeric` | NO | `null` | - | Usage percentage |
| `period_start` | `date` | NO | `null` | - | Period start date |
| `period_end` | `date` | NO | `null` | - | Period end date |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |

### 💰 **payroll**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `worker_id` | `uuid` | NO | `null` | - | Worker reference |
| `worker_name` | `text` | NO | `null` | - | Worker display name |
| `period_start` | `date` | NO | `null` | - | Pay period start |
| `period_end` | `date` | NO | `null` | - | Pay period end |
| `total_earnings` | `numeric` | YES | `0` | - | Total earnings |
| `paid_status` | `boolean` | YES | `false` | - | Payment status |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |

### 📅 **payroll_periods**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `period_name` | `text` | NO | `null` | - | Period display name |
| `start_date` | `date` | NO | `null` | - | Period start date |
| `end_date` | `date` | NO | `null` | - | Period end date |
| `status` | `text` | NO | `'active'` | - | Period status |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |
| `closed_at` | `timestamp with time zone` | YES | `null` | - | Closure timestamp |
| `notes` | `text` | YES | `null` | - | Additional notes |

###  **production_stats**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `date` | `date` | NO | `null` | - | Stat date |
| `completed_tasks` | `integer` | YES | `0` | - | Completed tasks count |
| `pending_tasks` | `integer` | YES | `0` | - | Pending tasks count |
| `revenue` | `numeric` | YES | `0` | - | Daily revenue |
| `efficiency_rate` | `numeric` | YES | `0` | - | Efficiency percentage |
| `active_workers` | `integer` | YES | `0` | - | Active workers count |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |

### 🏷️ **products**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `code` | `text` | NO | `null` | - | Product code |
| `name_ar` | `text` | NO | `null` | - | Arabic name |
| `name_en` | `text` | NO | `null` | - | English name |
| `category` | `text` | NO | `null` | - | Product category |
| `icon` | `text` | YES | `null` | - | Product icon URL |
| `active` | `boolean` | YES | `true` | - | Active status |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |

###  **rates**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `product` | `text` | NO | `null` | - | Product name |
| `task` | `text` | NO | `null` | - | Task name |
| `rate_per_unit` | `numeric` | NO | `null` | - | Rate per unit |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |

###  **stock**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `material` | `text` | NO | `null` | - | Material name |
| `unit` | `text` | NO | `null` | - | Unit of measurement |
| `current_stock` | `numeric` | YES | `0` | - | Current stock level |
| `reorder_threshold` | `numeric` | YES | `10` | - | Reorder threshold |
| `last_updated` | `timestamp with time zone` | YES | `now()` | - | Last update timestamp |

### 🔄 **stock_movements**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `stock_id` | `uuid` | NO | `null` | - | Stock reference |
| `type` | `text` | NO | `null` | - | Movement type |
| `quantity` | `numeric` | NO | `null` | - | Quantity moved |
| `note` | `text` | YES | `null` | - | Movement note |
| `created_at` | `timestamp without time zone` | NO | `now()` | - | Creation timestamp |

### ✅ **tasks**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `code` | `text` | NO | `null` | - | Task code |
| `name_ar` | `text` | NO | `null` | - | Arabic name |
| `name_en` | `text` | NO | `null` | - | English name |
| `description_ar` | `text` | YES | `null` | - | Arabic description |
| `description_en` | `text` | YES | `null` | - | English description |
| `icon` | `text` | YES | `null` | - | Task icon URL |
| `color_gradient` | `text` | YES | `null` | - | Color gradient |
| `active` | `boolean` | YES | `true` | - | Active status |
| `created_at` | `timestamp with time zone` | YES | `now()` | - | Creation timestamp |

###  **users**
| Column | Type | Nullable | Default | Key | Description |
|--------|------|----------|---------|-----|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Unique identifier |
| `email` | `text` | NO | `null` | - | User email |
| `name` | `text` | NO | `null` | - | User name |
| `role` | `text` | NO | `null` | - | User role |

---

## 🔗 **Key Relationships**

- **payroll** ↔ **payroll_periods**: Linked by date ranges
- **stock_movements** ↔ **stock**: Linked by `stock_id`
- **activities** ↔ **users**: Linked by `worker_id`
- **bom** ↔ **products**: Linked by product names
- **rates** ↔ **products** & **tasks**: Linked by names

---

## 📝 **Notes for Developers**

1. **UUID Primary Keys**: All tables use UUID primary keys with `gen_random_uuid()` default
2. **Timestamps**: Most tables include `created_at` timestamps
3. **Multilingual Support**: Products and tasks support Arabic/English names
4. **Status Fields**: Several tables use status fields for state management
5. **Numeric Types**: Use `numeric` for precise decimal calculations (money, quantities)
6. **Boolean Defaults**: Boolean fields default to sensible values (`true` for active, `false` for paid)

---

## 🚀 **Quick Reference Commands**

```sql
-- Get all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Get table structure
\d+ table_name

-- Get table data count
SELECT COUNT(*) FROM table_name;
```

---

## 🔄 **Schema Change Management**

### **Important Note for Developers**
Every time there is a change on the database or new tables are added, **this file must be updated** to reflect the current schema. This ensures:

1. **Documentation Accuracy**: All developers work with the correct schema information
2. **Team Synchronization**: Everyone understands the current database structure
3. **Onboarding Efficiency**: New developers can quickly understand the system
4. **Maintenance Clarity**: Clear structure for future modifications

### **How to Update This File**
1. **After any database migration**: Run the schema query and update this file
2. **When adding new tables**: Document the purpose, columns, and relationships
3. **When modifying existing tables**: Update the affected table documentation
4. **Version control**: Commit schema changes with the corresponding code changes

---

*Last Updated: $(date)*
*Schema Version: 1.0*
