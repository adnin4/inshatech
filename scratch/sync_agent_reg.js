const fs = require('fs');
const path = require('path');
const src = path.resolve(__dirname, '..', 'ai_brain', 'agents', 'agent_registry.js');
const dest = path.resolve(__dirname, '..', 'functions', '_shared', 'ai_brain', 'agents', 'agent_registry.js');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log('Synced agent_registry.js into functions/_shared/ai_brain/agents/');
