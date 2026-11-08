# Database Schema

## Overview
Total of 39 tables (17 original + 22 new). Designed for scalability and multi-tenant AI operations.

## Core Tables
- `users`: Standard auth mapping.
- `leads`: Scraped and inbound leads.
- `affiliates`: Affiliate profiles.
- `clicks`: Affiliate tracking.
- `conversions`: Sales tracking.
- `agents`: Configuration for the 13 agents.
- `audit_logs`: Security tracking.

## Row Level Security (RLS)
Enabled on all tables. Policies ensure users can only access their own data, while Admins have bypass rights.
