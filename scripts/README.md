# Migration Scripts

Automated scripts for migrating the DDVB Case Study Generator workflow to use external prompts.

## Scripts

### 1. `migrate-prompts.js`
**Automated migration script** - Updates workflow to load prompts from GitHub

**Usage:**
```bash
# Interactive mode (will prompt for GitHub URL)
node migrate-prompts.js

# Specify GitHub URL
node migrate-prompts.js --github-url=https://raw.githubusercontent.com/your-username/case-study-generator/main/prompts

# Dry run (preview changes without saving)
node migrate-prompts.js --dry-run

# Show help
node migrate-prompts.js --help
```

**Using npm scripts:**
```bash
npm run migrate              # Run migration
npm run migrate:dry-run      # Preview without saving
npm run help:migrate         # Show help
```

**What it does:**
1. ✅ Creates backup of original workflow
2. ✅ Adds "Load External Prompts" node
3. ✅ Updates 4 nodes to reference external prompts
4. ✅ Updates node connections
5. ✅ Validates changes
6. ✅ Saves updated workflow

**Output files:**
- `workflow/ddvb-case-study-generator.json` - Updated workflow
- `workflow/ddvb-case-study-generator.pre-migration.backup.json` - Backup

---

### 2. `test-migration.js`
**Test script** - Validates migrated workflow structure

**Usage:**
```bash
# Test default workflow
node test-migration.js

# Test specific workflow file
node test-migration.js --workflow=path/to/workflow.json

# Show help
node test-migration.js --help
```

**Using npm scripts:**
```bash
npm test              # Run tests
npm run help:test     # Show help
```

**What it tests:**
- ✓ Workflow structure is valid
- ✓ "Load External Prompts" node exists and is configured
- ✓ Node connections are correct
- ✓ All 4 nodes reference external prompts correctly
- ✓ No old embedded prompts remain (except fallbacks)
- ✓ GitHub URL is set (warns if placeholder)

**Exit codes:**
- `0` - All tests passed
- `1` - Some tests failed

---

### 3. `rollback-migration.js`
**Rollback script** - Restores workflow to pre-migration state

**Usage:**
```bash
# Rollback using default backup
node rollback-migration.js

# Rollback using specific backup
node rollback-migration.js --backup=path/to/backup.json

# Show help
node rollback-migration.js --help
```

**Using npm scripts:**
```bash
npm run rollback         # Rollback migration
npm run help:rollback    # Show help
```

**What it does:**
1. ✅ Locates backup file
2. ✅ Creates safety backup of current workflow
3. ✅ Restores workflow from backup
4. ✅ Validates restored workflow
5. ✅ Reports results

**Backup search order:**
1. Custom path (if specified with `--backup=`)
2. `workflow/ddvb-case-study-generator.pre-migration.backup.json`
3. `workflow/ddvb-case-study-generator.backup.json`

---

## Complete Migration Workflow

### Step 1: Prepare

1. **Ensure prompts are published to GitHub**:
   ```bash
   cd ..
   git add prompts/
   git commit -m "Add externalized prompts"
   git push origin main
   ```

2. **Verify prompts are accessible**:
   - Open in browser: `https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/perplexity-research.md`
   - Should display the prompt content

### Step 2: Run Migration

**Option A: Interactive**
```bash
cd scripts/
node migrate-prompts.js
```
- Script will prompt for your GitHub URL
- Enter: `https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts`
- Confirm changes

**Option B: One-line command**
```bash
node migrate-prompts.js --github-url=https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts
```

**Option C: Dry run first (recommended)**
```bash
node migrate-prompts.js --dry-run
# Review changes
node migrate-prompts.js --github-url=YOUR_URL
```

### Step 3: Test Migration

```bash
node test-migration.js
```

**Expected output:**
```
✓ Workflow Structure
✓ Load External Prompts Node
✓ Node Connections
✓ External Prompt References
✓ No Embedded Prompts

✅ All tests passed! Migration looks good.
```

### Step 4: Import to n8n

1. Open n8n interface
2. Deactivate old workflow
3. Import `workflow/ddvb-case-study-generator.json`
4. Verify GitHub URL in "Load External Prompts" node
5. Activate workflow

### Step 5: Test in Production

1. Send test message to Telegram bot
2. Check n8n execution logs
3. Verify "Prompts loaded successfully" message
4. Confirm case study quality

### Step 6: Rollback (if needed)

If something goes wrong:
```bash
node rollback-migration.js
```

Then import the restored workflow in n8n.

---

## Troubleshooting

### Migration fails with "Missing required nodes"

**Problem:** Script can't find expected nodes in workflow

**Solutions:**
1. Ensure you're using the correct workflow file
2. Check workflow hasn't been manually modified
3. Verify node IDs match expected values:
   - `parse-input`
   - `perplexity-research`
   - `prepare-openai`
   - `translate-to-russian`
   - `humanize-russian`

### Tests fail with "Perplexity references Load External Prompts: false"

**Problem:** Node wasn't updated correctly

**Solutions:**
1. Re-run migration: `node migrate-prompts.js`
2. Check backup wasn't corrupted
3. Manually verify node parameters in workflow JSON

### Rollback can't find backup

**Problem:** Backup file missing or in unexpected location

**Solutions:**
1. Check `workflow/` directory for backup files
2. Specify custom backup path: `node rollback-migration.js --backup=path/to/backup.json`
3. If no backup exists, use git history: `git checkout HEAD~1 workflow/ddvb-case-study-generator.json`

### GitHub URL still shows placeholder

**Warning in tests:** "GitHub URL still contains placeholder YOUR-USERNAME"

**Solutions:**
1. Re-run migration with correct URL
2. Manually edit "Load External Prompts" node in n8n
3. Update `GITHUB_BASE_URL` in workflow JSON directly

---

## Script Architecture

### `migrate-prompts.js`

**Key functions:**
- `readWorkflow()` - Loads workflow JSON
- `createBackup()` - Creates timestamped backup
- `createLoadPromptsNode()` - Generates new node with GitHub URL
- `updateNodes()` - Modifies 4 nodes to use external prompts
- `updateConnections()` - Rewires workflow graph
- `validateWorkflow()` - Ensures changes are correct
- `saveWorkflow()` - Writes updated workflow

**Node updates:**
1. **Perplexity Research** - Updates `messages` parameter
2. **Prepare OpenAI Request** - Replaces entire jsCode
3. **Translate to Russian** - Updates `messages` parameter
4. **Humanize Russian Text** - Updates `messages` parameter

### `test-migration.js`

**Test categories:**
1. **Structure tests** - Basic workflow validity
2. **Load Prompts Node tests** - New node exists and configured
3. **Connection tests** - Workflow graph correct
4. **External reference tests** - Nodes use external prompts
5. **Embedded prompt tests** - Old prompts removed

### `rollback-migration.js`

**Rollback process:**
1. Search for backup in multiple locations
2. Create safety backup of current state
3. Restore workflow from backup
4. Validate restored workflow
5. Report results and next steps

---

## Development

### Requirements
- Node.js >= 14.0.0
- No external dependencies (uses only Node.js built-ins)

### Testing locally

```bash
# Test migration on a copy
cp ../workflow/ddvb-case-study-generator.json test-workflow.json
node migrate-prompts.js --workflow=test-workflow.json --dry-run

# Test validation
node test-migration.js --workflow=test-workflow.json
```

### Adding features

All scripts are in plain Node.js with no dependencies for maximum portability.

**To add a new check to test script:**
1. Open `test-migration.js`
2. Add test to relevant function (e.g., `testStructure`)
3. Update documentation

**To modify migration logic:**
1. Open `migrate-prompts.js`
2. Update relevant function (e.g., `updatePerplexityNode`)
3. Test with `--dry-run`
4. Update tests in `test-migration.js`

---

## Files Generated

### During Migration
- `workflow/ddvb-case-study-generator.pre-migration.backup.json` - Original workflow backup
- `workflow/ddvb-case-study-generator.json` - Updated workflow (overwritten)

### During Rollback
- `workflow/ddvb-case-study-generator.pre-rollback.backup.json` - Safety backup before rollback

### Existing Backups
- `workflow/ddvb-case-study-generator.backup.json` - Original backup (created earlier)

---

## Version History

### v2.1.0 (Current)
- ✅ Automated migration script
- ✅ Comprehensive test suite
- ✅ Rollback functionality
- ✅ npm script aliases
- ✅ Dry-run mode
- ✅ Full documentation

### Future Enhancements
- [ ] Multi-prompt version testing
- [ ] Automated GitHub URL detection
- [ ] Visual diff of changes
- [ ] Integration tests with n8n API
- [ ] Prompt validation before migration

---

## Support

### Common Issues
See [Troubleshooting](#troubleshooting) section above

### Getting Help
1. Check script help: `node [script-name].js --help`
2. Review migration guide: `../docs/prompt-externalization-guide.md`
3. Check n8n execution logs
4. Review GitHub repository setup

### Reporting Bugs
When reporting issues, include:
- Script command used
- Full error output
- Node.js version: `node --version`
- Workflow backup (if applicable)

---

## License

Private - DDVB Analytics internal use only
