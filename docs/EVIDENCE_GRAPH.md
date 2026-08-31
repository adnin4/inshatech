# 🕸️ IINSHA AI-BOS: EVIDENCE GRAPH ARCHITECTURE

```text
================================================================================
          🌐 IINSHA AI-BOS: DIRECTED ACYCLIC EVIDENCE GRAPH
================================================================================
```

## 🔗 End-to-End Provenance Graph

```text
Customer
   ↓
Conversation
   ↓
Lead
   ↓
Proposal
   ↓
Order
   ↓
Mission
   ↓
Task
   ↓
Agent
   ↓
Tool
   ↓
Provider
   ↓
Artifact
   ↓
QA Audit
   ↓
Delivery
   ↓
Support
```

## 🛡️ Graph Consistency Checks

* **Zero Orphan Records:** Every mission, artifact, and QA record MUST have a parent order and customer node.
* **Zero Cross-Tenant Contamination:** Tenant boundary IDs are cryptographically hashed into graph node metadata.
* **Duplicate Detection:** Idempotency keys prevent duplicate side-effect edges.
