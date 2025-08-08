#!/usr/bin/env node

/**
 * Process Cleanup Utility for SmartPack Development
 * 
 * This script cleans up hanging Node.js processes and verifies port availability
 * before running the smartpack-coordinator or other development tools.
 * 
 * Usage:
 *   node scripts/cleanup-processes.js
 *   npm run cleanup
 */

import { exec, spawn } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);

const REQUIRED_PORTS = [3000, 5173, 11434]; // Backend, Frontend, Ollama
const PROCESS_PATTERNS = ['node.exe', 'node']; // Windows and Unix patterns

class ProcessCleanup {
  constructor() {
    this.isWindows = process.platform === 'win32';
    this.verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async checkPorts() {
    this.log('Checking port availability...');
    const busyPorts = [];

    for (const port of REQUIRED_PORTS) {
      try {
        const command = this.isWindows 
          ? `netstat -ano | findstr :${port}`
          : `lsof -i :${port}`;
        
        const { stdout } = await execAsync(command);
        if (stdout.trim()) {
          busyPorts.push(port);
          if (this.verbose) {
            this.log(`Port ${port} is busy:\n${stdout}`, 'warning');
          }
        }
      } catch (error) {
        // Port is free (command returns non-zero when no matches)
        if (this.verbose) {
          this.log(`Port ${port} is available`);
        }
      }
    }

    if (busyPorts.length > 0) {
      this.log(`Busy ports detected: ${busyPorts.join(', ')}`, 'warning');
      return busyPorts;
    } else {
      this.log('All required ports are available');
      return [];
    }
  }

  async findHangingProcesses() {
    this.log('Scanning for hanging Node.js processes...');
    const hangingProcesses = [];

    try {
      const command = this.isWindows 
        ? 'tasklist /FI "IMAGENAME eq node.exe" /FO CSV'
        : 'ps aux | grep node | grep -v grep';
      
      const { stdout } = await execAsync(command);
      
      if (stdout.trim()) {
        const lines = stdout.trim().split('\n');
        
        if (this.isWindows) {
          // Skip header line for Windows CSV output
          const processes = lines.slice(1).map(line => {
            const parts = line.split(',').map(part => part.replace(/"/g, ''));
            return {
              name: parts[0],
              pid: parts[1],
              memory: parts[4]
            };
          });
          hangingProcesses.push(...processes);
        } else {
          // Parse Unix ps output
          lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 11) {
              hangingProcesses.push({
                pid: parts[1],
                name: 'node',
                command: parts.slice(10).join(' ')
              });
            }
          });
        }
      }
    } catch (error) {
      if (this.verbose) {
        this.log('No Node.js processes found or command failed');
      }
    }

    return hangingProcesses;
  }

  async killProcesses(processes) {
    if (processes.length === 0) {
      this.log('No processes to kill');
      return true;
    }

    this.log(`Killing ${processes.length} hanging Node.js processes...`);
    let success = true;

    for (const process of processes) {
      try {
        const command = this.isWindows 
          ? `taskkill /F /PID ${process.pid}`
          : `kill -9 ${process.pid}`;
        
        await execAsync(command);
        this.log(`Killed process ${process.pid} (${process.name})`);
      } catch (error) {
        this.log(`Failed to kill process ${process.pid}: ${error.message}`, 'error');
        success = false;
      }
    }

    return success;
  }

  async waitForProcessCleanup(timeoutMs = 5000) {
    this.log('Waiting for process cleanup to complete...');
    
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const processes = await this.findHangingProcesses();
      if (processes.length === 0) {
        this.log('Process cleanup completed successfully');
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.log('Process cleanup timeout - some processes may still be running', 'warning');
    return false;
  }

  async verifyCleanup() {
    this.log('Verifying cleanup results...');
    
    const [busyPorts, hangingProcesses] = await Promise.all([
      this.checkPorts(),
      this.findHangingProcesses()
    ]);

    const isClean = busyPorts.length === 0 && hangingProcesses.length === 0;
    
    if (isClean) {
      this.log('✨ Environment is clean and ready for coordinator usage');
    } else {
      this.log('⚠️ Some issues remain after cleanup:', 'warning');
      if (busyPorts.length > 0) {
        this.log(`  - Busy ports: ${busyPorts.join(', ')}`, 'warning');
      }
      if (hangingProcesses.length > 0) {
        this.log(`  - Remaining processes: ${hangingProcesses.length}`, 'warning');
      }
    }

    return isClean;
  }

  async run() {
    console.log('🧹 SmartPack Process Cleanup Utility');
    console.log('=====================================');
    
    try {
      // Step 1: Initial scan
      const [initialBusyPorts, initialProcesses] = await Promise.all([
        this.checkPorts(),
        this.findHangingProcesses()
      ]);

      if (initialBusyPorts.length === 0 && initialProcesses.length === 0) {
        this.log('Environment is already clean - no cleanup needed');
        return true;
      }

      // Step 2: Kill hanging processes
      const killSuccess = await this.killProcesses(initialProcesses);
      
      // Step 3: Wait for cleanup
      await this.waitForProcessCleanup();
      
      // Step 4: Verify cleanup
      const isClean = await this.verifyCleanup();
      
      if (isClean) {
        console.log('\n🎉 Cleanup completed successfully!');
        console.log('You can now safely run the smartpack-coordinator.');
        return true;
      } else {
        console.log('\n⚠️ Cleanup completed with warnings.');
        console.log('Some processes or ports may still be in use.');
        console.log('Consider restarting your terminal or system if issues persist.');
        return false;
      }
      
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error');
      console.log('\n❌ Process cleanup failed.');
      console.log('You may need to manually kill processes or restart your system.');
      return false;
    }
  }
}

// Export for use in other scripts
export default ProcessCleanup;

// Run if called directly
const cleanup = new ProcessCleanup();
cleanup.run().then(success => {
  process.exit(success ? 0 : 1);
});