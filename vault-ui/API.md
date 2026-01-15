# API Documentation

## Overview

This document provides information about the Timelock Vault API endpoints and data structures.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://api.timelockdault.com`

## Authentication

All API requests require a valid Ethereum signature for authentication.

## Endpoints

### Get User Deposits

Retrieve all deposits for a specific user address.

```
GET /deposits/:address
```

**Parameters:**
- `address` (string): Ethereum address of the user

**Response:**
```json
{
  "deposits": [
    {
      "id": "string",
      "amount": "string",
      "lockDuration": "number",
      "unlockTime": "number",
      "isUnlocked": "boolean"
    }
  ]
}
```

### Get Vault Stats

Retrieve overall vault statistics.

```
GET /stats
```

**Response:**
```json
{
  "totalValueLocked": "string",
  "totalDeposits": "number",
  "totalUsers": "number",
  "averageAPY": "number"
}
```

### Get Transaction History

Retrieve transaction history for a user.

```
GET /transactions/:address
```

**Parameters:**
- `address` (string): Ethereum address
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response:**
```json
{
  "transactions": [
    {
      "hash": "string",
      "type": "deposit | withdrawal",
      "amount": "string",
      "timestamp": "number"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- Rate limit: 100 requests per minute per IP
- Rate limit headers are included in all responses:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when the limit resets

## WebSocket Events

Connect to WebSocket for real-time updates:

```
wss://api.timelockdault.com/ws
```

### Events

- `deposit`: New deposit created
- `withdrawal`: Withdrawal completed
- `unlock`: Deposit unlocked

## Data Types

### Deposit
```typescript
interface Deposit {
  id: string;
  user: string;
  amount: string;
  lockDuration: number;
  depositTime: number;
  unlockTime: number;
  isUnlocked: boolean;
  rewards: string;
}
```

### Transaction
```typescript
interface Transaction {
  hash: string;
  type: 'deposit' | 'withdrawal';
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}
```
