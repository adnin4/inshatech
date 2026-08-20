-- Make protected tables explicit deny-by-default and cover remaining unindexed foreign keys.

create policy deny_public_ibos_knowledge_chunks on public.ibos_knowledge_chunks
  for all to anon, authenticated using (false) with check (false);
create policy deny_public_ibos_knowledge_documents on public.ibos_knowledge_documents
  for all to anon, authenticated using (false) with check (false);
create policy deny_public_ibos_lead_events on public.ibos_lead_events
  for all to anon, authenticated using (false) with check (false);
create policy deny_public_ibos_leads on public.ibos_leads
  for all to anon, authenticated using (false) with check (false);
create policy deny_public_ibos_mission_checkpoints on public.ibos_mission_checkpoints
  for all to anon, authenticated using (false) with check (false);
create policy deny_public_ibos_orders on public.ibos_orders
  for all to anon, authenticated using (false) with check (false);

create index if not exists idx_ibos_affiliate_payouts_affiliate_id on public.ibos_affiliate_payouts(affiliate_id);
create index if not exists idx_ibos_agency_clients_reseller_id on public.ibos_agency_clients(reseller_id);
create index if not exists idx_ibos_agent_contracts_mission_id on public.ibos_agent_contracts(mission_id);
create index if not exists idx_ibos_attributions_lead_id on public.ibos_attributions(lead_id);
create index if not exists idx_ibos_autonomy_settings_tenant_id on public.ibos_autonomy_settings(tenant_id);
create index if not exists idx_ibos_black_box_traces_mission_id on public.ibos_black_box_traces(mission_id);
create index if not exists idx_ibos_cost_control_ledger_workspace_id on public.ibos_cost_control_ledger(workspace_id);
create index if not exists idx_ibos_daily_briefings_workspace_id on public.ibos_daily_briefings(workspace_id);
create index if not exists idx_ibos_departments_supervisor_employee on public.ibos_departments(supervisor_employee);
create index if not exists idx_ibos_deployments_rollback_of on public.ibos_deployments(rollback_of);
create index if not exists idx_ibos_durable_approvals_mission_id on public.ibos_durable_approvals(mission_id);
create index if not exists idx_ibos_fulfillment_projects_order_id on public.ibos_fulfillment_projects(order_id);
create index if not exists idx_ibos_fulfillment_projects_workspace_id on public.ibos_fulfillment_projects(workspace_id);
create index if not exists idx_ibos_memory_8layers_tenant_id on public.ibos_memory_8layers(tenant_id);
create index if not exists idx_ibos_memory_layers_tenant_id on public.ibos_memory_layers(tenant_id);
create index if not exists idx_ibos_mission_dags_target_department on public.ibos_mission_dags(target_department);
create index if not exists idx_ibos_page_blocks_page_id on public.ibos_page_blocks(page_id);
create index if not exists idx_ibos_recovery_events_mission_id on public.ibos_recovery_events(mission_id);
create index if not exists idx_ibos_revenue_attributions_responsible_employee on public.ibos_revenue_attributions(responsible_employee);
create index if not exists idx_ibos_workspaces_tenant_id on public.ibos_workspaces(tenant_id);
