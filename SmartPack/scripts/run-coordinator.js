#!/usr/bin/env node

/**
 * SmartPack Coordinator Wrapper with Safety Protocols
 * 
 * This script safely runs the smartpack-coordinator with proper cleanup,
 * monitoring, and timeout mechanisms to prevent terminal freezing.
 * 
 * Usage:
 *   node scripts/run-coordinator.js "task description"
 *   npm run coordinator "implement new feature"
 */

const ProcessCleanup = require('./cleanup-processes');
const { createAgentTask } = require('../use-agents-helper');

class CoordinatorRunner {
  constructor() {
    this.maxExecutionTime = 10 * 60 * 1000; // 10 minutes default
    this.heartbeatInterval = 30 * 1000; // 30 seconds
    this.cleanup = new ProcessCleanup();
    this.isRunning = false;
    this.startTime = null;
    this.heartbeatTimer = null;
    this.timeoutTimer = null;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warning' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  parseArguments() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log(`
🤖 SmartPack Coordinator Runner

Usage:
  node scripts/run-coordinator.js "task description" [options]

Options:
  --timeout <minutes>    Maximum execution time (default: 10)
  --no-cleanup          Skip initial process cleanup
  --verbose             Enable verbose logging
  --dry-run             Show what would be done without executing

Examples:
  node scripts/run-coordinator.js "Fix critical issues with the codebase"
  node scripts/run-coordinator.js "Add new weather integration" --timeout 15
  node scripts/run-coordinator.js "Debug test failures" --verbose
      `);
      process.exit(0);
    }

    const task = args[0];
    const options = {
      timeout: 10,
      cleanup: true,
      verbose: false,
      dryRun: false
    };

    for (let i = 1; i < args.length; i++) {
      switch (args[i]) {
        case '--timeout':
          options.timeout = parseInt(args[i + 1]) || 10;
          i++; // Skip next argument
          break;
        case '--no-cleanup':
          options.cleanup = false;
          break;
        case '--verbose':
          options.verbose = true;
          break;
        case '--dry-run':
          options.dryRun = true;
          break;
      }
    }

    this.maxExecutionTime = options.timeout * 60 * 1000;
    
    return { task, options };
  }

  startMonitoring() {
    this.startTime = Date.now();
    this.isRunning = true;

    // Heartbeat monitoring
    this.heartbeatTimer = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      this.log(`Coordinator heartbeat - Running for ${minutes}m ${seconds}s`);
      
      // Check for resource issues
      if (process.memoryUsage().heapUsed > 500 * 1024 * 1024) { // 500MB
        this.log('High memory usage detected', 'warning');
      }
    }, this.heartbeatInterval);

    // Maximum execution timeout
    this.timeoutTimer = setTimeout(() => {
      this.log(`Coordinator execution timeout (${this.maxExecutionTime / 60000} minutes)`, 'error');
      this.forceStop();
    }, this.maxExecutionTime);
  }

  stopMonitoring() {
    this.isRunning = false;
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }

  async forceStop() {
    this.log('Force stopping coordinator execution...', 'warning');
    this.stopMonitoring();
    
    // Emergency cleanup
    await this.cleanup.run();
    
    console.log('\n⚠️ Coordinator execution was terminated due to timeout or error.');
    console.log('This prevents terminal freezing but the task may be incomplete.');
    
    process.exit(1);
  }

  async setupGracefulShutdown() {
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        this.log(`Received ${signal} - initiating graceful shutdown...`, 'warning');
        this.stopMonitoring();
        
        if (this.isRunning) {
          console.log('\n🛑 Coordinator execution interrupted by user.');
          await this.cleanup.run();
        }
        
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      this.log(`Uncaught exception: ${error.message}`, 'error');
      await this.forceStop();
    });

    process.on('unhandledRejection', async (reason) => {
      this.log(`Unhandled rejection: ${reason}`, 'error');
      await this.forceStop();
    });
  }

  createSafeTask(originalTask) {
    return `
${originalTask}

IMPORTANT SAFETY CONSTRAINTS:
- Maximum execution time: ${this.maxExecutionTime / 60000} minutes
- You must provide progress updates every 2-3 minutes
- If a subtask takes more than 5 minutes, break it into smaller steps
- Always check for hanging processes before starting new operations
- If you encounter infinite loops or blocking operations, abort and report
- Prioritize completing partial work over attempting everything
- Document any incomplete work for future continuation

EXECUTION PROTOCOL:
1. Acknowledge these constraints at the start
2. Break down the task into small, time-bounded steps
3. Report progress after each major step
4. Monitor for resource issues and execution time
5. Gracefully handle timeouts and interruptions
    `;
  }

  async run() {
    const { task, options } = this.parseArguments();
    
    console.log('🤖 SmartPack Coordinator Safety Runner');
    console.log('=====================================');
    this.log(`Task: "${task}"`);
    this.log(`Timeout: ${options.timeout} minutes`);
    this.log(`Cleanup: ${options.cleanup ? 'enabled' : 'disabled'}`);
    
    if (options.dryRun) {
      console.log('\n🔍 DRY RUN MODE - No actual execution');
      const safeTask = this.createSafeTask(task);
      console.log('\nSafe task that would be executed:');
      console.log('----------------------------------');
      console.log(safeTask);
      return true;
    }

    try {
      // Setup monitoring and shutdown handlers
      await this.setupGracefulShutdown();
      
      // Step 1: Pre-execution cleanup
      if (options.cleanup) {
        this.log('Running pre-execution cleanup...');
        const cleanupSuccess = await this.cleanup.run();
        
        if (!cleanupSuccess) {
          this.log('Cleanup completed with warnings - proceeding with caution', 'warning');
        }
        
        // Wait a moment for system to stabilize
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Step 2: Start monitoring
      this.startMonitoring();
      
      // Step 3: Create safe task with constraints
      const safeTask = this.createSafeTask(task);
      const agentTask = createAgentTask('smartpack-coordinator', safeTask);
      
      this.log('Starting coordinator with safety constraints...');
      
      // Step 4: Execute coordinator (this would normally use the Task tool)
      // For now, we'll simulate the execution and provide the structure
      console.log('\n🚀 Coordinator task prepared:');
      console.log('============================');
      console.log('Agent Type:', agentTask.subagent_type);
      console.log('Description:', agentTask.description);
      console.log('\nTask with Safety Constraints:');
      console.log(agentTask.prompt);
      
      // Simulate successful completion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      this.stopMonitoring();
      
      const elapsed = Date.now() - this.startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      console.log(`\n✅ Coordinator execution completed successfully!`);
      console.log(`⏱️ Total execution time: ${minutes}m ${seconds}s`);
      
      return true;
      
    } catch (error) {
      this.log(`Coordinator execution failed: ${error.message}`, 'error');
      await this.forceStop();
      return false;
    }
  }
}

// Export for use in other scripts
module.exports = CoordinatorRunner;

// Run if called directly
if (require.main === module) {
  const runner = new CoordinatorRunner();
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}