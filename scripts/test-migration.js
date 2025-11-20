#!/usr/bin/env node

/**
 * DDVB Case Study Generator - Migration Test Script
 *
 * Tests the migrated workflow to ensure all external prompts are properly referenced
 * and the workflow structure is correct.
 *
 * Usage:
 *   node test-migration.js [--workflow=PATH]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  workflowPath: path.join(__dirname, '..', 'workflow', 'ddvb-case-study-generator.json')
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
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
  test: (name, passed) => {
    const icon = passed ? '✓' : '✗';
    const color = passed ? colors.green : colors.red;
    console.log(`  ${color}${icon}${colors.reset} ${name}`);
  }
};

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    workflowPath: null,
    help: false
  };

  args.forEach(arg => {
    if (arg.startsWith('--workflow=')) {
      options.workflowPath = arg.split('=')[1];
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  });

  return options;
}

// Show help
function showHelp() {
  console.log(`
${colors.bright}DDVB Case Study Generator - Migration Test${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node test-migration.js [options]

${colors.cyan}Options:${colors.reset}
  --workflow=PATH    Path to workflow file (optional)
  --help, -h         Show this help message

${colors.cyan}What this tests:${colors.reset}
  ✓ Workflow structure is valid
  ✓ "Load External Prompts" node exists
  ✓ Node connections are correct
  ✓ All 4 nodes reference external prompts
  ✓ GitHub URL is configured
  ✓ No embedded prompts remain
`);
}

// Load workflow
function loadWorkflow(workflowPath) {
  try {
    const content = fs.readFileSync(workflowPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log.error(`Failed to load workflow: ${error.message}`);
    process.exit(1);
  }
}

// Test workflow structure
function testStructure(workflow) {
  log.info('Testing workflow structure...\n');

  const tests = {
    'Has name': !!workflow.name,
    'Has nodes array': Array.isArray(workflow.nodes),
    'Has connections object': typeof workflow.connections === 'object',
    'Has at least 10 nodes': workflow.nodes && workflow.nodes.length >= 10,
    'Has version': !!workflow.versionId
  };

  Object.entries(tests).forEach(([name, passed]) => {
    log.test(name, passed);
  });

  const allPassed = Object.values(tests).every(Boolean);
  return allPassed;
}

// Test Load External Prompts node
function testLoadPromptsNode(workflow) {
  log.info('\nTesting "Load External Prompts" node...\n');

  const node = workflow.nodes.find(n => n.id === 'load-external-prompts');

  const tests = {
    'Node exists': !!node,
    'Node has correct name': node && node.name === 'Load External Prompts',
    'Node is Code type': node && node.type === 'n8n-nodes-base.code',
    'Has jsCode parameter': node && !!node.parameters.jsCode,
    'Code includes GITHUB_BASE_URL': node && node.parameters.jsCode.includes('GITHUB_BASE_URL'),
    'Code includes loadPrompts function': node && node.parameters.jsCode.includes('const loadPrompts'),
    'Code loads 4 prompts': node && node.parameters.jsCode.includes('perplexityResearch') &&
                              node.parameters.jsCode.includes('openaiGeneration') &&
                              node.parameters.jsCode.includes('russianTranslation') &&
                              node.parameters.jsCode.includes('russianHumanization'),
    'Has fallback mechanism': node && node.parameters.jsCode.includes('catch') &&
                               node.parameters.jsCode.includes('fallback')
  };

  Object.entries(tests).forEach(([name, passed]) => {
    log.test(name, passed);
  });

  // Check for placeholder URL
  if (node && node.parameters.jsCode.includes('YOUR-USERNAME')) {
    log.warning('\n  ⚠ GitHub URL still contains placeholder YOUR-USERNAME');
    log.warning('  Update GITHUB_BASE_URL in "Load External Prompts" node');
  }

  const allPassed = Object.values(tests).every(Boolean);
  return allPassed;
}

// Test connections
function testConnections(workflow) {
  log.info('\nTesting node connections...\n');

  const connections = workflow.connections;

  const tests = {
    'Parse Telegram Input connects to Load External Prompts':
      connections['Parse Telegram Input']?.main?.[0]?.[0]?.node === 'Load External Prompts',

    'Load External Prompts connects to Route Decision':
      connections['Load External Prompts']?.main?.[0]?.[0]?.node === 'Route Decision',

    'Has Perplexity Research connection':
      !!connections['Perplexity Research'],

    'Has Translate to Russian connection':
      !!connections['Translate to Russian'],

    'Has Humanize Russian Text connection':
      !!connections['Humanize Russian Text']
  };

  Object.entries(tests).forEach(([name, passed]) => {
    log.test(name, passed);
  });

  const allPassed = Object.values(tests).every(Boolean);
  return allPassed;
}

// Test individual nodes for external prompt references
function testNodesUseExternalPrompts(workflow) {
  log.info('\nTesting nodes reference external prompts...\n');

  // Find nodes
  const perplexityNode = workflow.nodes.find(n => n.id === 'perplexity-research');
  const prepareNode = workflow.nodes.find(n => n.id === 'prepare-openai');
  const translateNode = workflow.nodes.find(n => n.id === 'translate-to-russian');
  const humanizeNode = workflow.nodes.find(n => n.id === 'humanize-russian');

  const tests = {
    'Perplexity node exists': !!perplexityNode,
    'Perplexity references Load External Prompts':
      perplexityNode && JSON.stringify(perplexityNode).includes("$('Load External Prompts')"),
    'Perplexity uses prompts.perplexityResearch':
      perplexityNode && JSON.stringify(perplexityNode).includes('prompts.perplexityResearch'),

    'Prepare OpenAI node exists': !!prepareNode,
    'Prepare OpenAI references Load External Prompts':
      prepareNode && prepareNode.parameters.jsCode.includes("$('Load External Prompts')"),
    'Prepare OpenAI uses prompts.openaiGeneration':
      prepareNode && prepareNode.parameters.jsCode.includes('prompts.openaiGeneration'),

    'Translate node exists': !!translateNode,
    'Translate references Load External Prompts':
      translateNode && JSON.stringify(translateNode).includes("$('Load External Prompts')"),
    'Translate uses prompts.russianTranslation':
      translateNode && JSON.stringify(translateNode).includes('prompts.russianTranslation'),

    'Humanize node exists': !!humanizeNode,
    'Humanize references Load External Prompts':
      humanizeNode && JSON.stringify(humanizeNode).includes("$('Load External Prompts')"),
    'Humanize uses prompts.russianHumanization':
      humanizeNode && JSON.stringify(humanizeNode).includes('prompts.russianHumanization')
  };

  Object.entries(tests).forEach(([name, passed]) => {
    log.test(name, passed);
  });

  const allPassed = Object.values(tests).every(Boolean);
  return allPassed;
}

// Test for embedded prompts (should be removed)
function testNoEmbeddedPrompts(workflow) {
  log.info('\nTesting for embedded prompts (should be minimal/none)...\n');

  const workflowStr = JSON.stringify(workflow);

  // These strings shouldn't appear (they were in the old embedded prompts)
  const embeddedPromptSignatures = [
    'You are Ilya Morozov, Senior PR Executive',
    'IMPORTANT: The user will provide their request in RUSSIAN',
    'RUSSIAN MEDIA EDITORIAL STANDARDS',
    'Remove AI Patterns'
  ];

  const tests = {};
  embeddedPromptSignatures.forEach(signature => {
    const found = workflowStr.includes(signature);
    tests[`No embedded: "${signature.substring(0, 40)}..."`] = !found;
  });

  Object.entries(tests).forEach(([name, passed]) => {
    log.test(name, passed);
  });

  // Allow fallback prompts in Load External Prompts node
  const loadPromptsNode = workflow.nodes.find(n => n.id === 'load-external-prompts');
  if (loadPromptsNode && loadPromptsNode.parameters.jsCode.includes('FALLBACK:')) {
    log.info('\n  ℹ Fallback prompts found in Load External Prompts node (this is OK)');
  }

  const allPassed = Object.values(tests).every(Boolean);
  return allPassed;
}

// Run all tests
function runTests(workflowPath) {
  log.header('Migration Test Suite');

  log.info(`Testing workflow: ${workflowPath}\n`);

  const workflow = loadWorkflow(workflowPath);

  const results = {
    structure: testStructure(workflow),
    loadPromptsNode: testLoadPromptsNode(workflow),
    connections: testConnections(workflow),
    nodesUseExternal: testNodesUseExternalPrompts(workflow),
    noEmbedded: testNoEmbeddedPrompts(workflow)
  };

  // Summary
  log.header('Test Summary');

  const categories = [
    ['Workflow Structure', results.structure],
    ['Load External Prompts Node', results.loadPromptsNode],
    ['Node Connections', results.connections],
    ['External Prompt References', results.nodesUseExternal],
    ['No Embedded Prompts', results.noEmbedded]
  ];

  categories.forEach(([name, passed]) => {
    log.test(name, passed);
  });

  const allPassed = Object.values(results).every(Boolean);

  if (allPassed) {
    log.success('\n✅ All tests passed! Migration looks good.\n');
    return 0;
  } else {
    log.error('\n❌ Some tests failed. Please review the issues above.\n');
    return 1;
  }
}

// Main
function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  const workflowPath = options.workflowPath || CONFIG.workflowPath;

  if (!fs.existsSync(workflowPath)) {
    log.error(`Workflow file not found: ${workflowPath}`);
    process.exit(1);
  }

  const exitCode = runTests(workflowPath);
  process.exit(exitCode);
}

if (require.main === module) {
  main();
}

module.exports = { runTests };
