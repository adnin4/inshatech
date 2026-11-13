import fs from 'fs';

const microservices = JSON.parse(fs.readFileSync('scripts/extracted_microservices.json', 'utf8'));

// Determine geometry, rings, nodes, color for each category
const categoryMetadata = {
  'cat-agents': {
    color: '#a855f7',
    accent: '#c084fc',
    geometries: ['neural-polyhedron', 'dialog-rings', 'neural-polyhedron', 'dialog-rings', 'neural-polyhedron', 'neural-polyhedron', 'neural-polyhedron', 'dialog-rings', 'neural-polyhedron', 'neural-polyhedron']
  },
  'cat-workflow': {
    color: '#38bdf8',
    accent: '#7dd3fc',
    geometries: ['pipeline-flow', 'pipeline-flow', 'pipeline-flow', 'pipeline-flow', 'pipeline-flow', 'cube-lattice', 'test-gate', 'pipeline-flow', 'pipeline-flow', 'test-gate']
  },
  'cat-web': {
    color: '#10b981',
    accent: '#34d399',
    geometries: ['crawler-mesh', 'crawler-mesh', 'crawler-mesh', 'point-cloud', 'ocular-scan', 'crawler-mesh', 'crawler-mesh', 'point-cloud', 'crawler-mesh', 'crawler-mesh']
  },
  'cat-conv': {
    color: '#f472b6',
    accent: '#fb7185',
    geometries: ['dialog-rings', 'dialog-rings', 'dialog-rings', 'dialog-rings', 'neural-book', 'dialog-rings', 'dialog-rings', 'dialog-rings', 'neural-book', 'dialog-rings']
  },
  'cat-vision': {
    color: '#f59e0b',
    accent: '#fbbf24',
    geometries: ['ocular-scan', 'ocular-scan', 'ocular-scan', 'ocular-scan', 'test-gate', 'ocular-scan', 'ocular-scan', 'neural-polyhedron', 'ocular-scan', 'test-gate']
  },
  'cat-software': {
    color: '#38bdf8',
    accent: '#818cf8',
    geometries: ['cube-lattice', 'cube-lattice', 'cube-lattice', 'cube-lattice', 'cube-lattice', 'pipeline-flow', 'test-gate', 'cube-lattice', 'shield-gate', 'cube-lattice']
  },
  'cat-infra': {
    color: '#34d399',
    accent: '#6ee7b7',
    geometries: ['cloud-orbit', 'cloud-orbit', 'cloud-orbit', 'cloud-orbit', 'cube-lattice', 'cloud-orbit', 'pipeline-flow', 'cloud-orbit', 'cloud-orbit', 'shield-gate']
  },
  'cat-security': {
    color: '#a855f7',
    accent: '#e879f9',
    geometries: ['shield-gate', 'shield-gate', 'shield-gate', 'ledger-orbit', 'shield-gate', 'shield-gate', 'shield-gate', 'shield-gate', 'shield-gate', 'shield-gate']
  }
};

const configs = {};

// 1. Add 10 Commercial Services
const commercialServices = [
  { id: 'ai-video-studio', color: '#f472b6', accent: '#ec4899', geometry: 'video-reel', rings: 3, nodes: 12, label: '3D Video Timeline Reel' },
  { id: 'ai-saas-engineering', color: '#38bdf8', accent: '#0284c7', geometry: 'cube-lattice', rings: 3, nodes: 16, label: 'Distributed SaaS Architecture' },
  { id: 'ai-governance-operations', color: '#c084fc', accent: '#9333ea', geometry: 'shield-gate', rings: 4, nodes: 8, label: 'Zero-Trust Governance Ring' },
  { id: 'ecommerce-growth-operations', color: '#10b981', accent: '#059669', geometry: 'cube-lattice', rings: 3, nodes: 12, label: 'Commerce Fulfillment Lattice' },
  { id: 'ai-finance-automation', color: '#f59e0b', accent: '#d97706', geometry: 'ledger-orbit', rings: 3, nodes: 10, label: '3-Way Financial Ledger Orbit' },
  { id: 'ai-data-operations', color: '#6366f1', accent: '#4f46e5', geometry: 'point-cloud', rings: 2, nodes: 24, label: 'Semantic Vector Point Cloud' },
  { id: 'enterprise-knowledge-search', color: '#0ea5e9', accent: '#0284c7', geometry: 'neural-book', rings: 3, nodes: 14, label: 'Knowledge Graph Lattice' },
  { id: 'software-qa-release', color: '#14b8a6', accent: '#0d9488', geometry: 'test-gate', rings: 4, nodes: 10, label: 'Automated CI/CD Quality Gate' },
  { id: 'cloud-finops-reliability', color: '#06b6d4', accent: '#0891b2', geometry: 'cloud-orbit', rings: 3, nodes: 12, label: 'Edge SRE Observability Ring' },
  { id: 'computer-vision-systems', color: '#a855f7', accent: '#7c3aed', geometry: 'ocular-scan', rings: 3, nodes: 16, label: 'Computer Vision Scanner' }
];

commercialServices.forEach(cs => {
  configs[cs.id] = cs;
});

// 2. Add 8 Category Defaults
const categoryDefaults = [
  { id: 'cat-agents', color: '#a855f7', accent: '#c084fc', geometry: 'neural-polyhedron', rings: 3, nodes: 12, label: 'Agent Swarm Coordination' },
  { id: 'cat-workflow', color: '#38bdf8', accent: '#7dd3fc', geometry: 'pipeline-flow', rings: 3, nodes: 10, label: 'Observable Workflow Pipeline' },
  { id: 'cat-web', color: '#10b981', accent: '#34d399', geometry: 'crawler-mesh', rings: 3, nodes: 14, label: 'Headless Browser Mesh' },
  { id: 'cat-conv', color: '#f472b6', accent: '#fb7185', geometry: 'dialog-rings', rings: 4, nodes: 8, label: 'Conversational RAG Core' },
  { id: 'cat-vision', color: '#f59e0b', accent: '#fbbf24', geometry: 'ocular-scan', rings: 3, nodes: 12, label: 'Multimodal OCR Matrix' },
  { id: 'cat-software', color: '#38bdf8', accent: '#818cf8', geometry: 'cube-lattice', rings: 3, nodes: 12, label: 'Full-Stack Software Architecture' },
  { id: 'cat-infra', color: '#34d399', accent: '#6ee7b7', geometry: 'cloud-orbit', rings: 3, nodes: 10, label: 'Docker VPS Infrastructure' },
  { id: 'cat-security', color: '#a855f7', accent: '#e879f9', geometry: 'shield-gate', rings: 4, nodes: 8, label: 'Managed Zero-Trust Care' }
];

categoryDefaults.forEach(cd => {
  configs[cd.id] = cd;
});

// 3. Add 80 Microservices by ID and by Slug
const catIndexes = {};
microservices.forEach(svc => {
  const cat = svc.category;
  catIndexes[cat] = catIndexes[cat] || 0;
  const idx = catIndexes[cat]++;
  const catMeta = categoryMetadata[cat] || categoryDefaults[0];
  const geometry = catMeta.geometries[idx % catMeta.geometries.length];

  const cfg = {
    id: svc.id,
    slug: svc.slug,
    color: catMeta.color,
    accent: catMeta.accent,
    geometry: geometry,
    rings: 2 + (idx % 3),
    nodes: 8 + (idx % 8) * 2,
    label: svc.title
  };

  configs[svc.id] = cfg;
  configs[svc.slug] = cfg;
});

// 4. Add Legacy Aliases
configs['b2b-lead-swarm'] = configs['svc-06'] || configs['cat-agents'];
configs['ecommerce-ai-whatsapp'] = configs['svc-32'] || configs['cat-conv'];
configs['voice-ai-receptionist'] = configs['svc-34'] || configs['cat-conv'];
configs['n8n-docker-cluster'] = configs['svc-62'] || configs['cat-infra'];
configs['invoice-ocr-pipeline'] = configs['svc-41'] || configs['cat-vision'];

console.log('Total visual config entries:', Object.keys(configs).length);
fs.writeFileSync('scripts/generated_visual_configs.json', JSON.stringify(configs, null, 2));
