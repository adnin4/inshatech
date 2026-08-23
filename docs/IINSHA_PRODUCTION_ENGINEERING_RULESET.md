# 🛡️ IINSHA PRODUCTION ENGINEERING RULESET

## Absolute Operational Directives
1. **DO NOT redesign or rewrite the system wholesale.**
2. **DO NOT replace working implementations with simulations.**
3. **DO NOT create duplicate tables, APIs, agents, services, or configuration.**
4. **DO NOT label a capability LIVE unless executable production evidence exists.**
5. **DO NOT modify production directly.**
6. **DO NOT make destructive database changes without migration + backup + rollback.**
7. **DO NOT merge code that fails existing tests.**
8. **DO NOT continue to the next phase if the current phase gate fails.**

---

## 🔄 12-Step Change Execution Cycle
$$\begin{aligned}
\text{1. Inspect Implementation} &\longrightarrow \text{2. Identify Root Cause} \longrightarrow \text{3. Identify Dependencies} \\
\longrightarrow \text{4. Smallest Safe Change} &\longrightarrow \text{5. Targeted Tests} \longrightarrow \text{6. Regression Tests} \\
\longrightarrow \text{7. Browser E2E} &\longrightarrow \text{8. Invariant Verification} \longrightarrow \text{9. Parity Check} \\
\longrightarrow \text{10. Record Evidence} &\longrightarrow \text{11. Clear Commit} \longrightarrow \text{12. Next Bounded Task}
\end{aligned}$$
