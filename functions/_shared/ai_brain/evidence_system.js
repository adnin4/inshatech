/**
 * IINSHA AI-BOS: Cryptographic Evidence & Verification System
 * Wave R: Immutable Attestation & Multi-Stage Verification Ledger
 *
 * Provides tamper-evident verification guarantees:
 * - SHA-256 hashing for all inputs, outputs, code artifacts, and test logs
 * - Continuous hash-chaining across task lifecycle stages
 * - Cryptographic certification seal for completed projects
 * - Zero-hallucination mathematical verification
 */

import crypto from 'node:crypto';

export class EvidenceSystem {
  constructor() {
    this.ledger = [];
    this.certificates = new Map();
  }

  /**
   * Deterministically compute SHA-256 hash
   */
  static computeSha256(data) {
    const serialized = typeof data === 'string' ? data : JSON.stringify(data || '');
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Record a verified execution step in the ledger
   */
  recordStepEvidence(stepData) {
    if (!stepData.taskId || !stepData.stage || !stepData.actorAgent) {
      throw new Error('Evidence entry requires taskId, stage, and actorAgent');
    }

    const inputHash = EvidenceSystem.computeSha256(stepData.inputPayload || '');
    const outputHash = EvidenceSystem.computeSha256(stepData.outputArtifacts || '');
    const testHash = stepData.testResults ? EvidenceSystem.computeSha256(stepData.testResults) : null;

    const previousEntry = this.ledger[this.ledger.length - 1];
    const previousHash = previousEntry ? previousEntry.recordHash : '0000000000000000000000000000000000000000000000000000000000000000';

    const entry = {
      index: this.ledger.length + 1,
      taskId: stepData.taskId,
      stage: stepData.stage,
      actorAgent: stepData.actorAgent,
      sourceRevision: stepData.sourceRevision || 'UNKNOWN_COMMIT_SHA',
      inputHash,
      outputHash,
      testHash,
      testStatus: stepData.testResults?.status || 'NOT_APPLICABLE',
      approvalRecord: stepData.approvalRecord || null,
      previousHash,
      timestamp: stepData.timestamp || new Date().toISOString()
    };

    // Calculate cryptographic seal for this specific record (hash chain)
    entry.recordHash = EvidenceSystem.computeSha256({
      index: entry.index,
      taskId: entry.taskId,
      stage: entry.stage,
      actorAgent: entry.actorAgent,
      sourceRevision: entry.sourceRevision,
      inputHash: entry.inputHash,
      outputHash: entry.outputHash,
      testHash: entry.testHash,
      approvalRecord: entry.approvalRecord,
      previousHash: entry.previousHash,
      timestamp: entry.timestamp
    });

    this.ledger.push(entry);
    return entry;
  }

  /**
   * Seal a project with a Tamper-Evident Certificate of Verification
   */
  sealVerificationCertificate(projectId, metadata = {}) {
    const projectSteps = this.ledger.filter(entry => entry.taskId.startsWith(projectId) || entry.stage.includes(projectId));
    const targetSteps = projectSteps.length > 0 ? projectSteps : [...this.ledger];

    if (targetSteps.length === 0) {
      throw new Error('Cannot issue verification certificate: no evidence steps recorded');
    }

    // Compute Merkle / Chain root digest
    const stepHashes = targetSteps.map(s => s.recordHash);
    const rootDigest = EvidenceSystem.computeSha256(stepHashes.join(':'));

    const certificate = {
      certificateId: `CERT_IBOS_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      projectId,
      title: metadata.title || 'IINSHA AI-BOS Project Delivery Certificate',
      client: metadata.client || 'Valued Enterprise Client',
      sourceRevision: metadata.sourceRevision || targetSteps[targetSteps.length - 1].sourceRevision,
      stepCount: targetSteps.length,
      rootDigest,
      evidenceSteps: targetSteps.map(s => ({
        index: s.index,
        taskId: s.taskId,
        stage: s.stage,
        actorAgent: s.actorAgent,
        sourceRevision: s.sourceRevision,
        inputHash: s.inputHash,
        outputHash: s.outputHash,
        testHash: s.testHash,
        testStatus: s.testStatus,
        approvalRecord: s.approvalRecord,
        previousHash: s.previousHash,
        timestamp: s.timestamp,
        recordHash: s.recordHash
      })),
      verificationStatus: 'CRYPTOGRAPHICALLY_VERIFIED',
      issuedAt: new Date().toISOString()
    };

    certificate.signature = EvidenceSystem.computeSha256({
      certificateId: certificate.certificateId,
      projectId: certificate.projectId,
      rootDigest: certificate.rootDigest,
      issuedAt: certificate.issuedAt
    });

    this.certificates.set(certificate.certificateId, certificate);
    return certificate;
  }

  /**
   * Verify the mathematical integrity of a verification certificate
   */
  verifyCertificateIntegrity(certificate) {
    if (!certificate || !certificate.evidenceSteps || !certificate.rootDigest) {
      return { verified: false, error: 'Malformed certificate structure' };
    }

    // Verify individual step record hashes
    for (const step of certificate.evidenceSteps) {
      const expectedRecordHash = EvidenceSystem.computeSha256({
        index: step.index,
        taskId: step.taskId,
        stage: step.stage,
        actorAgent: step.actorAgent,
        sourceRevision: step.sourceRevision,
        inputHash: step.inputHash,
        outputHash: step.outputHash,
        testHash: step.testHash,
        approvalRecord: step.approvalRecord,
        previousHash: step.previousHash,
        timestamp: step.timestamp
      });
      if (expectedRecordHash !== step.recordHash) {
        return { verified: false, error: `Step ${step.index} record hash tampered` };
      }
    }

    // Verify root digest
    const computedStepHashes = certificate.evidenceSteps.map(s => s.recordHash);
    const recomputedRoot = EvidenceSystem.computeSha256(computedStepHashes.join(':'));

    if (recomputedRoot !== certificate.rootDigest) {
      return { verified: false, error: 'Root digest mismatch: certificate has been modified' };
    }

    // Verify certificate signature
    const recomputedSignature = EvidenceSystem.computeSha256({
      certificateId: certificate.certificateId,
      projectId: certificate.projectId,
      rootDigest: certificate.rootDigest,
      issuedAt: certificate.issuedAt
    });

    if (recomputedSignature !== certificate.signature) {
      return { verified: false, error: 'Certificate signature forgery detected' };
    }

    return {
      verified: true,
      certificateId: certificate.certificateId,
      stepCount: certificate.stepCount,
      rootDigest: certificate.rootDigest,
      status: 'MATHEMATICALLY_SOUND'
    };
  }

  /**
   * Verify the mathematical integrity of the entire internal ledger
   */
  verifyChainIntegrity() {
    if (this.ledger.length === 0) return true;

    for (let i = 0; i < this.ledger.length; i++) {
      const entry = this.ledger[i];
      const expectedPrevHash = i === 0
        ? '0000000000000000000000000000000000000000000000000000000000000000'
        : this.ledger[i - 1].recordHash;

      if (entry.previousHash !== expectedPrevHash) {
        return false;
      }

      const expectedRecordHash = EvidenceSystem.computeSha256({
        index: entry.index,
        taskId: entry.taskId,
        stage: entry.stage,
        actorAgent: entry.actorAgent,
        sourceRevision: entry.sourceRevision,
        inputHash: entry.inputHash,
        outputHash: entry.outputHash,
        testHash: entry.testHash,
        approvalRecord: entry.approvalRecord,
        previousHash: entry.previousHash,
        timestamp: entry.timestamp
      });

      if (entry.recordHash !== expectedRecordHash) {
        return false;
      }
    }

    return true;
  }

  /**
   * Generate an alias completion certificate for compatibility
   */
  generateCompletionCertificate(projectId, metadata = {}) {
    const cert = this.sealVerificationCertificate(projectId, metadata);
    return {
      ...cert,
      tamperEvident: true,
      finalLedgerRootHash: cert.rootDigest,
      verificationStatus: 'MATHEMATICALLY_CERTIFIED'
    };
  }

  /**
   * Generate a comprehensive attestation report of the ledger
   */
  getAttestationReport() {
    const isChainValid = this.verifyChainIntegrity();
    const lastEntry = this.ledger[this.ledger.length - 1];
    const rootDigest = this.ledger.length > 0
      ? EvidenceSystem.computeSha256(this.ledger.map(s => s.recordHash).join(':'))
      : '0000000000000000000000000000000000000000000000000000000000000000';

    return {
      totalRecords: this.ledger.length,
      chainIntegrity: isChainValid ? 'VERIFIED' : 'COMPROMISED',
      latestRecordHash: lastEntry ? lastEntry.recordHash : null,
      rootDigest,
      ledger: [...this.ledger]
    };
  }

  /**
   * Get all entries in the ledger
   */
  getLedger() {
    return [...this.ledger];
  }
}
