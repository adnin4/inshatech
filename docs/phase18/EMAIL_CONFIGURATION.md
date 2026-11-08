# 📧 EMAIL_CONFIGURATION.md — Email Provider Configuration Guide

| Key Name | Purpose | Value Status | Security Guard |
| :--- | :--- | :---: | :--- |
| `RESEND_API_KEY` | Live Email Dispatch Key | **NOT_CONFIGURED** | Secret environment binding only |
| `EMAIL_FROM_ADDRESS` | Sender Envelope | `noreply@inshatech.pages.dev` | Valid SPF/DKIM required on custom domain |
| `SMTP_HOST` | Optional SMTP Fallback | **NOT_CONFIGURED** | Non-browser access only |
