/**
 * IINSHA AI-BOS: Task DAG Orchestrator Engine
 * Wave Q: Multi-Agent Task Dependency Graph Orchestration
 *
 * Manages deterministic task DAG execution with:
 * - Topological dependency resolution & cycle detection
 * - State machine: PENDING -> READY -> IN_PROGRESS -> AWAITING_APPROVAL -> COMPLETED / FAILED / CANCELLED
 * - Configurable retries, timeouts, and error handling
 * - Single-click Human-in-the-Loop (HITL) approval gates for high-risk actions
 * - Full execution telemetry and step history
 */

export class TaskDagOrchestrator {
  constructor() {
    this.dags = new Map();
  }

  /**
   * Create a new empty DAG definition
   */
  createDag(dagId, metadata = {}) {
    if (this.dags.has(dagId)) {
      throw new Error(`DAG with id '${dagId}' already exists`);
    }

    const dag = {
      id: dagId,
      metadata: {
        title: metadata.title || dagId,
        description: metadata.description || '',
        createdAt: new Date().toISOString(),
        ...metadata
      },
      tasks: new Map(),
      status: 'INITIALIZED', // INITIALIZED, RUNNING, PAUSED_FOR_APPROVAL, COMPLETED, FAILED, CANCELLED
      executionLog: [],
      startedAt: null,
      completedAt: null
    };

    this.dags.set(dagId, dag);
    return dag;
  }

  /**
   * Add a task to an existing DAG
   */
  addTask(dagId, taskConfig) {
    const dag = this.dags.get(dagId);
    if (!dag) {
      throw new Error(`DAG '${dagId}' not found`);
    }

    if (!taskConfig.id) {
      throw new Error('Task must have a unique id');
    }

    if (dag.tasks.has(taskConfig.id)) {
      throw new Error(`Task '${taskConfig.id}' already exists in DAG '${dagId}'`);
    }

    const task = {
      id: taskConfig.id,
      name: taskConfig.name || taskConfig.id,
      agentId: taskConfig.agentId || 'DEVELOPER_AGENT',
      stage: taskConfig.stage || 'EXECUTION',
      dependencies: Array.isArray(taskConfig.dependencies) ? [...taskConfig.dependencies] : [],
      payload: taskConfig.payload || {},
      status: 'PENDING', // PENDING, READY, IN_PROGRESS, AWAITING_APPROVAL, COMPLETED, FAILED, CANCELLED
      result: null,
      error: null,
      retryCount: 0,
      maxRetries: typeof taskConfig.maxRetries === 'number' ? taskConfig.maxRetries : 2,
      timeoutMs: taskConfig.timeoutMs || 30000,
      requiresHitl: Boolean(taskConfig.requiresHitl),
      riskClass: taskConfig.riskClass || 'LOW', // LOW, MEDIUM, HIGH, CRITICAL
      approval: null,
      startedAt: null,
      completedAt: null
    };

    dag.tasks.set(task.id, task);
    return task;
  }

  /**
   * Validate DAG for cycles and unresolved dependencies
   */
  validateDag(dagId) {
    const dag = this.dags.get(dagId);
    if (!dag) throw new Error(`DAG '${dagId}' not found`);

    const inDegree = new Map();
    const adj = new Map();

    for (const [id] of dag.tasks) {
      inDegree.set(id, 0);
      adj.set(id, []);
    }

    for (const [id, task] of dag.tasks) {
      for (const dep of task.dependencies) {
        if (!dag.tasks.has(dep)) {
          throw new Error(`Task '${id}' depends on missing task '${dep}' in DAG '${dagId}'`);
        }
        adj.get(dep).push(id);
        inDegree.set(id, inDegree.get(id) + 1);
      }
    }

    // Kahn's algorithm for cycle detection
    const queue = [];
    for (const [id, deg] of inDegree) {
      if (deg === 0) queue.push(id);
    }

    let visitedCount = 0;
    while (queue.length > 0) {
      const u = queue.shift();
      visitedCount++;
      for (const v of adj.get(u)) {
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    if (visitedCount !== dag.tasks.size) {
      throw new Error(`Cycle detected in DAG '${dagId}' — circular dependencies not allowed`);
    }

    return true;
  }

  /**
   * Execute DAG tasks respecting dependency order and HITL gates
   */
  async executeDag(dagId, context = {}, taskExecutor = null) {
    this.validateDag(dagId);
    const dag = this.dags.get(dagId);

    if (dag.status === 'INITIALIZED') {
      dag.status = 'RUNNING';
      dag.startedAt = new Date().toISOString();
    }

    let progressMade = true;

    while (progressMade && dag.status === 'RUNNING') {
      progressMade = false;

      // Find all tasks whose dependencies are COMPLETED and are currently PENDING
      for (const [id, task] of dag.tasks) {
        if (task.status !== 'PENDING') continue;

        const depsSatisfied = task.dependencies.every(depId => {
          const depTask = dag.tasks.get(depId);
          return depTask && depTask.status === 'COMPLETED';
        });

        if (!depsSatisfied) continue;

        // Check if any dependency failed
        const anyDepFailed = task.dependencies.some(depId => {
          const depTask = dag.tasks.get(depId);
          return depTask && (depTask.status === 'FAILED' || depTask.status === 'CANCELLED');
        });

        if (anyDepFailed) {
          task.status = 'CANCELLED';
          task.error = 'Dependency failed or cancelled';
          dag.executionLog.push({ taskId: id, event: 'TASK_CANCELLED_DEP_FAILURE', timestamp: new Date().toISOString() });
          continue;
        }

        // Check for HITL Gate
        if (task.requiresHitl && !task.approval) {
          task.status = 'AWAITING_APPROVAL';
          dag.status = 'PAUSED_FOR_APPROVAL';
          dag.executionLog.push({ taskId: id, event: 'PAUSED_FOR_HITL_APPROVAL', riskClass: task.riskClass, timestamp: new Date().toISOString() });
          return this.getDagSummary(dagId);
        }

        // Execute task
        task.status = 'IN_PROGRESS';
        task.startedAt = new Date().toISOString();
        dag.executionLog.push({ taskId: id, agentId: task.agentId, event: 'TASK_STARTED', timestamp: task.startedAt });
        progressMade = true;

        try {
          let output;
          if (typeof taskExecutor === 'function') {
            output = await taskExecutor(task, context, dag);
          } else {
            // Default built-in mock execution
            output = { executed: true, taskId: id, agentId: task.agentId, output: `Completed stage ${task.stage}` };
          }

          task.result = output;
          task.status = 'COMPLETED';
          task.completedAt = new Date().toISOString();
          dag.executionLog.push({ taskId: id, event: 'TASK_COMPLETED', timestamp: task.completedAt });
        } catch (err) {
          task.retryCount++;
          if (task.retryCount <= task.maxRetries) {
            task.status = 'PENDING'; // Retry
            dag.executionLog.push({ taskId: id, event: 'TASK_RETRY_SCHEDULED', retry: task.retryCount, error: err.message, timestamp: new Date().toISOString() });
          } else {
            task.status = 'FAILED';
            task.error = err.message;
            task.completedAt = new Date().toISOString();
            dag.executionLog.push({ taskId: id, event: 'TASK_FAILED', error: err.message, timestamp: task.completedAt });
            dag.status = 'FAILED';
            return this.getDagSummary(dagId);
          }
        }
      }
    }

    // Check completion status
    const allDone = Array.from(dag.tasks.values()).every(t => t.status === 'COMPLETED' || t.status === 'CANCELLED');
    if (allDone) {
      const anyFailed = Array.from(dag.tasks.values()).some(t => t.status === 'FAILED');
      dag.status = anyFailed ? 'FAILED' : 'COMPLETED';
      dag.completedAt = new Date().toISOString();
    }

    return this.getDagSummary(dagId);
  }

  /**
   * Approve a task paused at AWAITING_APPROVAL
   */
  async approveTask(dagId, taskId, approver = { actor: 'owner', signature: 'APPROVED' }, context = {}, taskExecutor = null) {
    const dag = this.dags.get(dagId);
    if (!dag) throw new Error(`DAG '${dagId}' not found`);

    const task = dag.tasks.get(taskId);
    if (!task) throw new Error(`Task '${taskId}' not found in DAG '${dagId}'`);

    if (task.status !== 'AWAITING_APPROVAL') {
      throw new Error(`Task '${taskId}' is not in AWAITING_APPROVAL status (currently ${task.status})`);
    }

    task.approval = {
      approved: true,
      actor: approver.actor || 'system_owner',
      signature: approver.signature || 'VALID_OWNER_AUTH',
      timestamp: new Date().toISOString()
    };

    dag.executionLog.push({ taskId, event: 'HITL_TASK_APPROVED', actor: task.approval.actor, timestamp: task.approval.timestamp });

    // Reset task to pending so executeDag can run it
    task.status = 'PENDING';
    dag.status = 'RUNNING';

    return this.executeDag(dagId, context, taskExecutor);
  }

  /**
   * Cancel DAG execution
   */
  cancelDag(dagId, reason = 'Cancelled by operator') {
    const dag = this.dags.get(dagId);
    if (!dag) throw new Error(`DAG '${dagId}' not found`);

    dag.status = 'CANCELLED';
    for (const [, task] of dag.tasks) {
      if (task.status === 'PENDING' || task.status === 'IN_PROGRESS' || task.status === 'AWAITING_APPROVAL') {
        task.status = 'CANCELLED';
        task.error = reason;
      }
    }

    dag.executionLog.push({ event: 'DAG_CANCELLED', reason, timestamp: new Date().toISOString() });
    return this.getDagSummary(dagId);
  }

  /**
   * Get comprehensive summary of DAG state
   */
  getDagSummary(dagId) {
    const dag = this.dags.get(dagId);
    if (!dag) throw new Error(`DAG '${dagId}' not found`);

    const taskArray = Array.from(dag.tasks.values());
    const counts = {
      total: taskArray.length,
      pending: taskArray.filter(t => t.status === 'PENDING').length,
      inProgress: taskArray.filter(t => t.status === 'IN_PROGRESS').length,
      awaitingApproval: taskArray.filter(t => t.status === 'AWAITING_APPROVAL').length,
      completed: taskArray.filter(t => t.status === 'COMPLETED').length,
      failed: taskArray.filter(t => t.status === 'FAILED').length,
      cancelled: taskArray.filter(t => t.status === 'CANCELLED').length
    };

    return {
      dagId: dag.id,
      status: dag.status,
      title: dag.metadata.title,
      taskCounts: counts,
      tasks: taskArray.map(t => ({
        id: t.id,
        name: t.name,
        agentId: t.agentId,
        stage: t.stage,
        dependencies: t.dependencies,
        status: t.status,
        requiresHitl: t.requiresHitl,
        riskClass: t.riskClass,
        hasResult: !!t.result,
        error: t.error,
        completedAt: t.completedAt
      })),
      executionLogCount: dag.executionLog.length,
      startedAt: dag.startedAt,
      completedAt: dag.completedAt
    };
  }
}
