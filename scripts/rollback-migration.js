#!/usr/bin/env node

/**
 * DDVB Case Study Generator - Rollback Migration Script
 *
 * This script rolls back the prompt externalization migration by restoring
 * the workflow from the backup created during migration.
 *
 * Usage:
 *   node rollback-migration.js [--backup=PATH]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  workflowPath: path.join(__dirname, '..', 'workflow', 'ddvb-case-study-generator.json'),
  backupPath: path.join(__dirname, '..', 'workflow', 'ddvb-case-study-generator.pre-migration.backup.json'),
  originalBackupPath: path.join(__dirname, '..', 'workflow', 'ddvb-case-study-generator.backup.json')
};

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    backupPath: null,
    help: false
  };

  args.forEach(arg => {
    if (arg.startsWith('--backup=')) {
      options.backupPath = arg.split('=')[1];
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  });

  return options;
}

// Show help
function showHelp() {
  console.log(`
${colors.bright}DDVB Case Study Generator - Rollback Migration${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node rollback-migration.js [options]

${colors.cyan}Options:${colors.reset}
  --backup=PATH    Path to backup file (optional)
  --help, -h       Show this help message

${colors.cyan}Examples:${colors.reset}
  # Use default backup location
  node rollback-migration.js

  # Specify custom backup
  node rollback-migration.js --backup=./my-backup.json

${colors.cyan}What this does:${colors.reset}
  1. Locates backup file
  2. Creates safety backup of current workflow
  3. Restores workflow from backup
  4. Validates restored workflow
  5. Reports results
`);
}

// Find backup file
function findBackup(customPath) {
  log.header('Rollback Migration');
  log.info('Searching for backup file...');

  // Priority order for backup files
  const backupPaths = [
    customPath,
    CONFIG.backupPath,
    CONFIG.originalBackupPath
  ].filter(Boolean);

  for (const backupPath of backupPaths) {
    if (fs.existsSync(backupPath)) {
      log.success(`Found backup: ${backupPath}`);
      return backupPath;
    }
  }

  log.error('No backup file found!');
  console.log('\nSearched locations:');
  backupPaths.forEach(p => console.log(`  - ${p}`));
  console.log('\nCannot rollback without a backup file.');
  process.exit(1);
}

// Create safety backup
function createSafetyBackup() {
  log.info('Creating safety backup of current workflow...');

  const safetyBackupPath = CONFIG.workflowPath.replace('.json', '.pre-rollback.backup.json');

  try {
    fs.copyFileSync(CONFIG.workflowPath, safetyBackupPath);
    log.success(`Safety backup created: ${safetyBackupPath}`);
    return safetyBackupPath;
  } catch (error) {
    log.error(`Failed to create safety backup: ${error.message}`);
    process.exit(1);
  }
}

// Restore from backup
function restoreFromBackup(backupPath) {
  log.info('Restoring workflow from backup...');

  try {
    // Read backup
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    const backupWorkflow = JSON.parse(backupContent);

    // Validate backup
    if (!backupWorkflow.nodes || !backupWorkflow.connections) {
      log.error('Invalid backup file - missing nodes or connections');
      process.exit(1);
    }

    // Write to workflow file
    fs.writeFileSync(
      CONFIG.workflowPath,
      JSON.stringify(backupWorkflow, null, 2),
      'utf8'
    );

    log.success('Workflow restored from backup');
    return backupWorkflow;
  } catch (error) {
    log.error(`Failed to restore from backup: ${error.message}`);
    process.exit(1);
  }
}

// Validate restored workflow
function validateWorkflow(workflow) {
  log.info('Validating restored workflow...');

  const checks = {
    hasNodes: workflow.nodes && workflow.nodes.length > 0,
    hasConnections: workflow.connections && Object.keys(workflow.connections).length > 0,
    hasName: !!workflow.name,
    noLoadPromptsNode: !workflow.nodes.some(n => n.id === 'load-external-prompts')
  };

  const allValid = Object.values(checks).every(Boolean);

  if (allValid) {
    log.success('Validation passed - workflow looks correct');
  } else {
    log.warning('Some validation checks failed:');
    Object.entries(checks).forEach(([check, passed]) => {
      if (!passed) {
        log.warning(`  - ${check}: FAILED`);
      }
    });
  }

  return allValid;
}

// Show summary
function showSummary(workflow, backupPath, safetyBackupPath) {
  log.header('Rollback Summary');

  console.log(`${colors.bright}Workflow:${colors.reset} ${workflow.name}`);
  console.log(`${colors.bright}Nodes:${colors.reset} ${workflow.nodes.length}`);
  console.log(`${colors.bright}Restored from:${colors.reset} ${backupPath}`);
  console.log(`${colors.bright}Safety backup:${colors.reset} ${safetyBackupPath}`);
  console.log(`${colors.bright}Output:${colors.reset} ${CONFIG.workflowPath}`);

  console.log('\n' + colors.bright + 'Changes Made:' + colors.reset);
  console.log('  ✓ Workflow restored to pre-migration state');
  console.log('  ✓ Embedded prompts restored');
  console.log('  ✓ "Load External Prompts" node removed');
  console.log('  ✓ Original node connections restored');

  console.log('\n' + colors.bright + 'Next Steps:' + colors.reset);
  console.log('  1. Import restored workflow into n8n');
  console.log('  2. Test with a sample message');
  console.log('  3. Verify case study generation works');

  console.log('\n' + colors.yellow + 'Note:' + colors.reset + ' Prompts are now embedded in workflow again');
  console.log('To re-migrate: node migrate-prompts.js\n');
}

// Main rollback function
function rollback() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  const backupPath = findBackup(options.backupPath);
  const safetyBackupPath = createSafetyBackup();
  const workflow = restoreFromBackup(backupPath);
  const isValid = validateWorkflow(workflow);

  if (!isValid) {
    log.warning('\nRollback completed but validation failed');
    log.warning('Please manually verify the workflow is correct');
  }

  showSummary(workflow, backupPath, safetyBackupPath);

  log.success('✅ Rollback completed successfully!\n');
}

// Run rollback
if (require.main === module) {
  rollback();
}

module.exports = { rollback };
