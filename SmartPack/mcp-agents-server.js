#!/usr/bin/env node
/**
 * SmartPack Agents MCP Server
 * Exposes SmartPack specialized agents as MCP tools
 */

const fs = require('fs');
const path = require('path');

// Read agent configurations
const agentsDir = path.join(__dirname, '.claude', 'agents');
const agents = {};

// Load all agent configurations
if (fs.existsSync(agentsDir)) {
  const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  
  agentFiles.forEach(file => {
    const agentName = path.basename(file, '.md');
    const content = fs.readFileSync(path.join(agentsDir, file), 'utf8');
    
    // Parse front matter to get agent info
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let metadata = {};
    
    if (frontMatterMatch) {
      const frontMatter = frontMatterMatch[1];
      frontMatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          metadata[key.trim()] = valueParts.join(':').trim();
        }
      });
    }
    
    agents[agentName] = {
      name: metadata.name || agentName,
      description: metadata.description || 'SmartPack specialized agent',
      content: content
    };
  });
}

// MCP Server implementation
class SmartPackAgentsMCP {
  constructor() {
    this.tools = this.createTools();
  }

  createTools() {
    const tools = {};
    
    Object.keys(agents).forEach(agentName => {
      const agent = agents[agentName];
      tools[`agent_${agentName}`] = {
        name: `agent_${agentName}`,
        description: agent.description,
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "The task for the agent to perform"
            },
            context: {
              type: "string",
              description: "Additional context for the task"
            }
          },
          required: ["task"]
        }
      };
    });
    
    return tools;
  }

  async callTool(name, args) {
    const agentName = name.replace('agent_', '');
    const agent = agents[agentName];
    
    if (!agent) {
      return {
        content: [{
          type: "text",
          text: `Agent ${agentName} not found`
        }]
      };
    }

    // Return the agent instructions and task
    return {
      content: [{
        type: "text",
        text: `Executing ${agent.name}:\n\nTask: ${args.task}\n\nAgent Instructions:\n${agent.content}\n\nContext: ${args.context || 'None provided'}`
      }]
    };
  }

  async listTools() {
    return Object.values(this.tools);
  }
}

// Start MCP server
const server = new SmartPackAgentsMCP();

// Handle MCP protocol messages
process.stdin.on('data', async (data) => {
  try {
    const message = JSON.parse(data.toString());
    
    if (message.method === 'tools/list') {
      const tools = await server.listTools();
      console.log(JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        result: { tools }
      }));
    } else if (message.method === 'tools/call') {
      const result = await server.callTool(message.params.name, message.params.arguments);
      console.log(JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        result
      }));
    }
  } catch (error) {
    console.log(JSON.stringify({
      jsonrpc: "2.0",
      id: message?.id || null,
      error: {
        code: -32603,
        message: error.message
      }
    }));
  }
});

console.error('SmartPack Agents MCP Server started');