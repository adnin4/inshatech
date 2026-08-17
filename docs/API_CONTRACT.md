# API Contract

## Endpoints

### `/api/ai/chat`
- **Request:** `{ "message": string, "agent_id": string }`
- **Response:** `{ "reply": string, "metadata": object }`

### `/api/affiliate/track`
- **Request:** `{ "affiliate_id": string, "campaign_id": string, ... }`
- **Response:** `{ "status": "SUCCESS", "click": object }`

### `/api/affiliate/convert`
- **Request:** `{ "order_id": string, "affiliate_id": string, "order_amount": number }`
- **Response:** `{ "status": "SUCCESS", "conversion": object }`

*(Other endpoints detailed internally: `/api/services`, `/api/leads`, `/api/tools/execute`, `/api/payments/checkout`, `/api/payments/webhook`, `/api/knowledge/search`, `/api/auth/session`, `/api/admin/gate`)*
