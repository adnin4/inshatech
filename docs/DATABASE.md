# IINSHATECH DATABASE ARCHITECTURE & SCHEMA REFERENCE
**Database Engine**: Supabase PostgreSQL 15+  
**Extensions**: `uuid-ossp`, `pgcrypto`, `vector`  

---

## 1. Schema Overview & Entity Relationships

```
+-------------------+       +--------------------+       +---------------------+
| ibos_services     |<------| ibos_orders        |------>| ibos_affiliates     |
+-------------------+       +--------------------+       +---------------------+
| id (PK)           |       | id (PK)            |       | id (PK)             |
| slug (UNIQUE)     |       | order_code (UNIQUE)|       | aff_id (UNIQUE)     |
| title             |       | service_id (FK)    |       | name, email         |
| price, currency   |       | amount, bdt_amount |       | commission_rate     |
| packages (JSONB)  |       | affiliate_ref_code |       | earnings_total      |
| features (JSONB)  |       | payment_status     |       | earnings_pending    |
+-------------------+       +--------------------+       +---------------------+
```

---

## 2. Table Specifications

### `ibos_content_words`
- `id` (UUID, Primary Key)
- `word_key` (VARCHAR 128, Unique) — Key identifier (e.g. `HERO_TITLE`).
- `word_value` (TEXT) — Content value.
- `category` (VARCHAR 64) — UI section grouping.

### `ibos_services`
- `id` (UUID, Primary Key)
- `slug` (VARCHAR 128, Unique)
- `title` (VARCHAR 255)
- `price` (DECIMAL 10,2)
- `commission_rate` (DECIMAL 5,2)
- `packages` (JSONB Array of Tier Objects)
- `features` (JSONB Array of strings)

### `ibos_affiliates`
- `id` (UUID, Primary Key)
- `aff_id` (VARCHAR 64, Unique) — Referral code (e.g. `AFF10025`).
- `earnings_total` (DECIMAL 12,2)
- `earnings_pending` (DECIMAL 12,2)

---

## 3. Migration Tracking
All database schema changes are strictly version-controlled under `/supabase/migrations/`.
- `20260809000000_init_iinsha_os.sql` (Initial production schema).
