# Tool Permissions

## Inventory
- `read_db`: LEVEL_1
- `write_db`: LEVEL_2
- `execute_workflow`: LEVEL_3
- `manage_billing`: LEVEL_4

## Assignments
- Content Creator can only `read_db`.
- Workflow Coordinator can `execute_workflow`.
- Finance Agent requires LEVEL_4 for `manage_billing`.

## Approval Workflows
Any tool mapped to LEVEL_3 or higher requires an explicit payload sent to the Guardian for verification before execution.
