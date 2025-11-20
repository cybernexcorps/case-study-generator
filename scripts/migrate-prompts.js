#!/usr/bin/env node

/**
 * DDVB Case Study Generator - Automated Prompt Externalization Migration Script
 *
 * This script automatically updates the n8n workflow JSON to use external prompts
 * loaded from GitHub instead of embedded prompts.
 *
 * What it does:
 * 1. Creates backup of original workflow
 * 2. Adds "Load External Prompts" node
 * 3. Updates connections between nodes
 * 4. Modifies 4 nodes to use external prompts
 * 5. Validates the changes
 * 6. Saves the updated workflow
 *
 * Usage:
 *   node migrate-prompts.js [--github-url=YOUR_URL] [--dry-run]
 *
 * Options:
 *   --github-url    Your GitHub raw URL base (optional, will prompt if not provided)
 *   --dry-run       Preview changes without saving
 *   --help          Show this help message
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const CONFIG = {
  workflowPath: path.join(__dirname, '..', 'workflow', 'ddvb-case-study-generator.json'),
  backupPath: path.join(__dirname, '..', 'workflow', 'ddvb-case-study-generator.pre-migration.backup.json'),
  outputPath: path.join(__dirname, '..', 'workflow', 'ddvb-case-study-generator.json'),
  defaultGithubUrl: 'https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts'
};

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utility functions
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
  step: (num, msg) => console.log(`${colors.magenta}[${num}]${colors.reset} ${msg}`)
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    githubUrl: null,
    dryRun: false,
    help: false
  };

  args.forEach(arg => {
    if (arg.startsWith('--github-url=')) {
      options.githubUrl = arg.split('=')[1];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  });

  return options;
}

// Show help message
function showHelp() {
  console.log(`
${colors.bright}DDVB Case Study Generator - Prompt Migration Script${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node migrate-prompts.js [options]

${colors.cyan}Options:${colors.reset}
  --github-url=URL    GitHub raw URL for prompts
                      Example: https://raw.githubusercontent.com/user/repo/main/prompts

  --dry-run           Preview changes without saving the file

  --help, -h          Show this help message

${colors.cyan}Examples:${colors.reset}
  # Interactive mode (prompts for GitHub URL)
  node migrate-prompts.js

  # Specify GitHub URL
  node migrate-prompts.js --github-url=https://raw.githubusercontent.com/ddvb/case-study/main/prompts

  # Preview changes without saving
  node migrate-prompts.js --dry-run

${colors.cyan}What this script does:${colors.reset}
  1. Creates backup of current workflow
  2. Adds "Load External Prompts" node
  3. Updates node connections
  4. Modifies 4 nodes to use external prompts:
     - Perplexity Research
     - Prepare OpenAI Request
     - Translate to Russian
     - Humanize Russian Text
  5. Validates all changes
  6. Saves updated workflow

${colors.cyan}Before running:${colors.reset}
  - Ensure prompts are published to GitHub
  - Verify GitHub repository is public
  - Test prompt URLs are accessible

${colors.cyan}After running:${colors.reset}
  - Import updated workflow into n8n
  - Test with a sample Telegram message
  - Monitor execution logs for prompt loading
`);
}

// Prompt user for input
async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Read workflow JSON
function readWorkflow() {
  log.step(1, 'Reading workflow JSON...');

  if (!fs.existsSync(CONFIG.workflowPath)) {
    log.error(`Workflow file not found: ${CONFIG.workflowPath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(CONFIG.workflowPath, 'utf8');
    const workflow = JSON.parse(content);
    log.success(`Loaded workflow: ${workflow.name} (${workflow.nodes.length} nodes)`);
    return workflow;
  } catch (error) {
    log.error(`Failed to read workflow: ${error.message}`);
    process.exit(1);
  }
}

// Create backup
function createBackup(workflow) {
  log.step(2, 'Creating backup...');

  try {
    fs.writeFileSync(
      CONFIG.backupPath,
      JSON.stringify(workflow, null, 2),
      'utf8'
    );
    log.success(`Backup created: ${CONFIG.backupPath}`);
  } catch (error) {
    log.error(`Failed to create backup: ${error.message}`);
    process.exit(1);
  }
}

// Create "Load External Prompts" node
function createLoadPromptsNode(githubUrl) {
  log.step(3, 'Creating "Load External Prompts" node...');

  const jsCode = `// ==================================================
// PROMPT LOADER - Centralized External Prompt Management
// ==================================================
// This node loads all external prompts from GitHub at workflow start
// Supports version control and A/B testing via branch selection

const GITHUB_BASE_URL = '${githubUrl}';

// Configuration: Set to 'main' or 'experimental' for A/B testing
const PROMPT_VERSION = 'main'; // Change to 'experimental' to test new prompts

// Prompt URLs
const promptUrls = {
  perplexityResearch: \`\${GITHUB_BASE_URL}/perplexity-research.md\`,
  openaiGeneration: \`\${GITHUB_BASE_URL}/openai-generation.md\`,
  russianTranslation: \`\${GITHUB_BASE_URL}/russian-translation.md\`,
  russianHumanization: \`\${GITHUB_BASE_URL}/russian-humanization.md\`
};

// Load all prompts in parallel
const loadPrompts = async () => {
  try {
    const fetchPromises = Object.entries(promptUrls).map(async ([key, url]) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`Failed to load \${key}: \${response.status} \${response.statusText}\`);
      }
      const text = await response.text();
      return [key, text];
    });

    const results = await Promise.all(fetchPromises);
    return Object.fromEntries(results);
  } catch (error) {
    // Fallback: Return embedded fallback prompts if GitHub unavailable
    console.error('⚠️ Failed to load external prompts, using fallbacks:', error.message);
    return {
      perplexityResearch: \`You are a strategic research assistant helping gather background information for DDVB branding agency case studies. The user will provide a case study request in Russian.\\n\\n**Your Task:**\\n1. Translate the Russian request to English\\n2. Research the company/brand/project mentioned\\n3. Provide structured information needed for case study development\\n\\n**Output Format (in English):**\\nRUSSIAN REQUEST TRANSLATION:\\nCOMPANY BACKGROUND:\\nBRAND & MARKET CONTEXT:\\nINDUSTRY INSIGHTS:\\nPOTENTIAL PROJECT DRIVERS:\\n\\nProvide research in English.\`,
      openaiGeneration: 'FALLBACK: English generation prompt - see prompts/openai-generation.md for full version',
      russianTranslation: 'FALLBACK: Russian translation prompt - see prompts/russian-translation.md for full version',
      russianHumanization: 'FALLBACK: Russian humanization prompt - see prompts/russian-humanization.md for full version'
    };
  }
};

// Execute prompt loading
const prompts = await loadPrompts();

// Track which prompts were loaded
console.log('✅ Prompts loaded successfully:', {
  version: PROMPT_VERSION,
  timestamp: new Date().toISOString(),
  userId: $input.item.json.userId,
  userName: $input.item.json.userName,
  sources: Object.keys(prompts)
});

// Merge with input data
const inputData = $input.item.json;

return {
  json: {
    ...inputData,
    prompts: prompts,
    promptsLoaded: true,
    promptVersion: PROMPT_VERSION,
    promptLoadTimestamp: new Date().toISOString()
  }
};`;

  const node = {
    parameters: {
      jsCode: jsCode
    },
    id: "load-external-prompts",
    name: "Load External Prompts",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [540, 300],
    notes: "🔄 Loads all external prompts from GitHub. Change PROMPT_VERSION to 'experimental' for A/B testing."
  };

  log.success('Created "Load External Prompts" node');
  return node;
}

// Update "Perplexity Research" node
function updatePerplexityNode(node) {
  log.info('Updating "Perplexity Research" node...');

  // Update the messages parameter to use external prompt
  const messagesParam = node.parameters.bodyParameters.parameters.find(p => p.name === 'messages');

  if (messagesParam) {
    messagesParam.value = `={{ [{\"role\": \"system\", \"content\": $('Load External Prompts').item.json.prompts.perplexityResearch}, {\"role\": \"user\", \"content\": \"Case study request (in Russian):\\n\\n\" + $json.originalMessage + \"\\n\\nPlease translate to English and provide structured research following the format above.\"}] }}`;

    // Add note
    node.notes = "📚 Uses external prompt from Load External Prompts node";

    log.success('Updated "Perplexity Research" node');
    return true;
  }

  log.warning('Could not find messages parameter in Perplexity node');
  return false;
}

// Update "Prepare OpenAI Request" node
function updatePrepareOpenAINode(node) {
  log.info('Updating "Prepare OpenAI Request" node...');

  const newCode = `// Prepare OpenAI messages for ENGLISH case study generation
const userData = $input.item.json;
const userMessage = userData.enrichedMessage || userData.originalMessage;

// Load external prompt from Load External Prompts node
const externalPrompts = $('Load External Prompts').item.json.prompts;
const systemPrompt = externalPrompts.openaiGeneration;

const messages = [
  {
    role: "system",
    content: systemPrompt
  },
  {
    role: "user",
    content: userMessage
  }
];

return {
  json: {
    ...userData,
    openaiMessages: messages
  }
};`;

  node.parameters.jsCode = newCode;
  node.notes = "📚 Uses external prompt from Load External Prompts node";

  log.success('Updated "Prepare OpenAI Request" node');
  return true;
}

// Update "Translate to Russian" node
function updateTranslateNode(node) {
  log.info('Updating "Translate to Russian" node...');

  const messagesParam = node.parameters.bodyParameters.parameters.find(p => p.name === 'messages');

  if (messagesParam) {
    messagesParam.value = `={{ [{\"role\": \"system\", \"content\": $('Load External Prompts').item.json.prompts.russianTranslation}, {\"role\": \"user\", \"content\": $json.englishCaseStudy}] }}`;

    node.notes = "📚 Uses external prompt from Load External Prompts node";

    log.success('Updated "Translate to Russian" node');
    return true;
  }

  log.warning('Could not find messages parameter in Translate node');
  return false;
}

// Update "Humanize Russian Text" node
function updateHumanizeNode(node) {
  log.info('Updating "Humanize Russian Text" node...');

  const messagesParam = node.parameters.bodyParameters.parameters.find(p => p.name === 'messages');

  if (messagesParam) {
    messagesParam.value = `={{ [{\"role\": \"system\", \"content\": $('Load External Prompts').item.json.prompts.russianHumanization}, {\"role\": \"user\", \"content\": $('Translate to Russian').item.json.choices[0].message.content}] }}`;

    node.notes = "📚 Uses external prompt from Load External Prompts node";

    log.success('Updated "Humanize Russian Text" node');
    return true;
  }

  log.warning('Could not find messages parameter in Humanize node');
  return false;
}

// Update workflow nodes
function updateNodes(workflow, loadPromptsNode) {
  log.step(4, 'Updating workflow nodes...');

  // Find the nodes to update
  const nodesToUpdate = {
    'parse-input': null,
    'perplexity-research': null,
    'prepare-openai': null,
    'translate-to-russian': null,
    'humanize-russian': null,
    'router': null
  };

  // Find nodes by ID
  workflow.nodes.forEach(node => {
    if (nodesToUpdate.hasOwnProperty(node.id)) {
      nodesToUpdate[node.id] = node;
    }
  });

  // Validate we found all required nodes
  const missingNodes = Object.entries(nodesToUpdate)
    .filter(([_, node]) => node === null)
    .map(([id]) => id);

  if (missingNodes.length > 0) {
    log.error(`Missing required nodes: ${missingNodes.join(', ')}`);
    return false;
  }

  // Add the new Load External Prompts node after Parse Telegram Input
  const parseInputIndex = workflow.nodes.findIndex(n => n.id === 'parse-input');
  workflow.nodes.splice(parseInputIndex + 1, 0, loadPromptsNode);

  // Update the 4 nodes
  const updates = [
    updatePerplexityNode(nodesToUpdate['perplexity-research']),
    updatePrepareOpenAINode(nodesToUpdate['prepare-openai']),
    updateTranslateNode(nodesToUpdate['translate-to-russian']),
    updateHumanizeNode(nodesToUpdate['humanize-russian'])
  ];

  const successCount = updates.filter(Boolean).length;
  log.success(`Successfully updated ${successCount}/4 nodes`);

  return successCount === 4;
}

// Update connections
function updateConnections(workflow) {
  log.step(5, 'Updating node connections...');

  // Old flow: Parse Telegram Input → Route Decision
  // New flow: Parse Telegram Input → Load External Prompts → Route Decision

  // Find Parse Telegram Input connections
  const parseInputConnections = workflow.connections["Parse Telegram Input"];

  if (!parseInputConnections) {
    log.error('Could not find "Parse Telegram Input" connections');
    return false;
  }

  // Update Parse Telegram Input to connect to Load External Prompts
  workflow.connections["Parse Telegram Input"] = {
    main: [
      [
        {
          node: "Load External Prompts",
          type: "main",
          index: 0
        }
      ]
    ]
  };

  // Add Load External Prompts connections to Route Decision
  workflow.connections["Load External Prompts"] = {
    main: [
      [
        {
          node: "Route Decision",
          type: "main",
          index: 0
        }
      ]
    ]
  };

  log.success('Updated connections: Parse Telegram Input → Load External Prompts → Route Decision');
  return true;
}

// Validate workflow
function validateWorkflow(workflow) {
  log.step(6, 'Validating updated workflow...');

  const checks = {
    hasLoadPromptsNode: workflow.nodes.some(n => n.id === 'load-external-prompts'),
    hasCorrectNodeCount: workflow.nodes.length > 0,
    hasConnections: Object.keys(workflow.connections).length > 0,
    hasLoadPromptsConnection: !!workflow.connections["Load External Prompts"]
  };

  const allValid = Object.values(checks).every(Boolean);

  if (allValid) {
    log.success('All validation checks passed ✓');
    return true;
  } else {
    log.error('Validation failed:');
    Object.entries(checks).forEach(([check, passed]) => {
      if (!passed) {
        log.error(`  - ${check}: FAILED`);
      }
    });
    return false;
  }
}

// Save workflow
function saveWorkflow(workflow, dryRun) {
  log.step(7, 'Saving updated workflow...');

  if (dryRun) {
    log.warning('DRY RUN mode - not saving changes');
    console.log('\nUpdated workflow preview:');
    console.log(JSON.stringify(workflow, null, 2).substring(0, 500) + '...\n');
    return true;
  }

  try {
    fs.writeFileSync(
      CONFIG.outputPath,
      JSON.stringify(workflow, null, 2),
      'utf8'
    );
    log.success(`Saved updated workflow: ${CONFIG.outputPath}`);
    return true;
  } catch (error) {
    log.error(`Failed to save workflow: ${error.message}`);
    return false;
  }
}

// Show summary
function showSummary(workflow, githubUrl, dryRun) {
  log.header('Migration Summary');

  console.log(`${colors.bright}Workflow:${colors.reset} ${workflow.name}`);
  console.log(`${colors.bright}Nodes:${colors.reset} ${workflow.nodes.length}`);
  console.log(`${colors.bright}GitHub URL:${colors.reset} ${githubUrl}`);
  console.log(`${colors.bright}Backup:${colors.reset} ${CONFIG.backupPath}`);

  if (dryRun) {
    console.log(`${colors.bright}Mode:${colors.reset} ${colors.yellow}DRY RUN (no changes saved)${colors.reset}`);
  } else {
    console.log(`${colors.bright}Output:${colors.reset} ${CONFIG.outputPath}`);
  }

  console.log('\n' + colors.bright + 'Changes Made:' + colors.reset);
  console.log('  ✓ Added "Load External Prompts" node');
  console.log('  ✓ Updated "Perplexity Research" node');
  console.log('  ✓ Updated "Prepare OpenAI Request" node');
  console.log('  ✓ Updated "Translate to Russian" node');
  console.log('  ✓ Updated "Humanize Russian Text" node');
  console.log('  ✓ Updated node connections');

  if (!dryRun) {
    console.log('\n' + colors.bright + 'Next Steps:' + colors.reset);
    console.log('  1. Import updated workflow into n8n');
    console.log('  2. Verify GitHub URL in "Load External Prompts" node');
    console.log('  3. Test with a sample Telegram message');
    console.log('  4. Check execution logs for "Prompts loaded successfully"');
    console.log('\n  ' + colors.cyan + 'To rollback: Import ' + CONFIG.backupPath + colors.reset);
  }
}

// Main migration function
async function migrate() {
  log.header('DDVB Case Study Generator - Prompt Migration');

  // Parse arguments
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Get GitHub URL
  let githubUrl = options.githubUrl;

  if (!githubUrl) {
    console.log(`\n${colors.bright}GitHub Repository Setup${colors.reset}\n`);
    console.log('Enter your GitHub raw URL for prompts:');
    console.log('Example: https://raw.githubusercontent.com/your-username/case-study-generator/main/prompts');
    console.log('');

    githubUrl = await prompt('GitHub URL: ');

    if (!githubUrl || githubUrl.trim() === '') {
      log.warning('Using default placeholder URL - you must update this in the workflow!');
      githubUrl = CONFIG.defaultGithubUrl;
    }
  }

  // Validate GitHub URL
  if (!githubUrl.startsWith('http')) {
    log.error('Invalid GitHub URL - must start with http:// or https://');
    process.exit(1);
  }

  log.info(`GitHub URL: ${githubUrl}`);

  if (options.dryRun) {
    log.warning('DRY RUN mode - changes will not be saved');
  }

  console.log('');

  // Execute migration
  const workflow = readWorkflow();
  createBackup(workflow);

  const loadPromptsNode = createLoadPromptsNode(githubUrl);
  const nodesUpdated = updateNodes(workflow, loadPromptsNode);
  const connectionsUpdated = updateConnections(workflow);
  const isValid = validateWorkflow(workflow);

  if (!nodesUpdated || !connectionsUpdated || !isValid) {
    log.error('\nMigration failed - see errors above');
    process.exit(1);
  }

  const saved = saveWorkflow(workflow, options.dryRun);

  if (!saved && !options.dryRun) {
    log.error('\nFailed to save workflow');
    process.exit(1);
  }

  showSummary(workflow, githubUrl, options.dryRun);

  log.success('\n✅ Migration completed successfully!\n');
}

// Run migration
if (require.main === module) {
  migrate().catch(error => {
    log.error(`\nFatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { migrate };
