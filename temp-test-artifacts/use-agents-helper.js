/**
 * SmartPack Agents Helper
 * Helper functions to use agents with the Task tool
 */

const fs = require('fs');
const path = require('path');

// Load agent instructions
function loadAgent(agentName) {
  const agentPath = path.join(__dirname, '.claude', 'agents', `${agentName}.md`);
  
  if (!fs.existsSync(agentPath)) {
    throw new Error(`Agent ${agentName} not found at ${agentPath}`);
  }
  
  return fs.readFileSync(agentPath, 'utf8');
}

// Create Task prompt with agent instructions
function createAgentTask(agentName, task, context = '') {
  const agentInstructions = loadAgent(agentName);
  
  return {
    subagent_type: "general-purpose",
    description: `Execute ${agentName} task`,
    prompt: `${agentInstructions}

## Your Current Task:
${task}

## Additional Context:
${context}

Please execute this task following the agent instructions above.`
  };
}

// Available agents
const availableAgents = [
  'smartpack-coordinator',
  'smartpack-architecture-analyzer', 
  'smartpack-code-fixer',
  'smartpack-test-auditor',
  'smartpack-test-specialist'
];

console.log('Available SmartPack Agents:');
availableAgents.forEach(agent => {
  console.log(`- ${agent}`);
});

console.log('\nUsage Example:');
console.log('const task = createAgentTask("smartpack-coordinator", "Fix critical issues with the codebase");');

module.exports = { loadAgent, createAgentTask, availableAgents };