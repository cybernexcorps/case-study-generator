# Prompt Externalization Guide

## Overview

This guide explains how to use externalized prompts in the DDVB Case Study Generator n8n workflow. Prompts have been extracted from the workflow JSON into separate `.md` files for easier maintenance, version control, and A/B testing.

## What Changed

### Before (v2.0.0)
- All 4 prompts were embedded directly in the workflow JSON
- Total embedded prompt size: ~23,000 characters
- Difficult to update, test, or version control prompts
- Required workflow import/export for every prompt change

### After (v2.1.0)
- All 4 prompts stored in separate `.md` files in `prompts/` directory
- Prompts loaded dynamically from GitHub at runtime
- Easy to update prompts without touching workflow
- Support for A/B testing via branch selection
- Automatic fallback to embedded prompts if GitHub unavailable

## File Structure

```
case-study-generator/
├── prompts/
│   ├── perplexity-research.md          # Perplexity research prompt
│   ├── openai-generation.md            # English case study generation
│   ├── russian-translation.md          # Russian translation standards
│   ├── russian-humanization.md         # AI humanization prompt
│   └── prompt-config.json              # Configuration file
├── workflow/
│   ├── ddvb-case-study-generator.json  # Updated workflow (v2.1.0)
│   └── ddvb-case-study-generator.backup.json  # Original backup
└── docs/
    └── prompt-externalization-guide.md  # This file
```

## Setup Instructions

### Step 1: Publish Prompts to GitHub

1. **Create a GitHub repository** (if you don't have one):
   ```bash
   cd "D:\Downloads\SynologyDrive\DDVB Analytics\marketing-automation-n8n\case-study-generator"
   git init
   git add .
   git commit -m "Add case study generator with externalized prompts"
   git remote add origin https://github.com/YOUR-USERNAME/case-study-generator.git
   git push -u origin main
   ```

2. **Verify prompts are accessible via raw GitHub URLs**:
   ```
   https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/perplexity-research.md
   https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/openai-generation.md
   https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/russian-translation.md
   https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/russian-humanization.md
   ```

3. **Test in browser**: Open each URL to ensure prompts load correctly.

### Step 2: Update Workflow Configuration

1. **Open the workflow in n8n**:
   - Go to n8n interface
   - Import `workflow/ddvb-case-study-generator.json`

2. **Update GitHub URLs in "Load External Prompts" node**:
   - Find the "Load External Prompts" node
   - Edit the JavaScript code
   - Replace `YOUR-USERNAME/YOUR-REPO` with your actual GitHub details:

   ```javascript
   const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts';
   ```

3. **Save and activate** the workflow.

### Step 3: Test the Workflow

Send a test message to your Telegram bot:

```
Создай кейс DDVB для Sostav.ru о ребрендинге крафтовой пивоварни "Хмель & Солод".
Продажи выросли на 45% после запуска новой айдентики от DDVB.
```

**Check execution logs** to verify:
- ✅ "Load External Prompts" node executed successfully
- ✅ All 4 prompts loaded from GitHub
- ✅ Case study generated correctly

## Workflow Changes

### New Node: "Load External Prompts"

**Position**: Between "Parse Telegram Input" and "Route Decision"

**Purpose**: Loads all 4 prompts from GitHub at workflow start

**Configuration**:
- Fetches prompts from GitHub raw URLs
- Stores prompts in workflow data for reuse
- Includes automatic fallback to embedded prompts
- Supports version control via branch selection

### Modified Nodes

#### 1. Perplexity Research
- **Before**: Embedded 1,200-char prompt in API call
- **After**: References `$('Load External Prompts').item.json.prompts.perplexityResearch`

#### 2. Prepare OpenAI Request
- **Before**: 17,500-char embedded system prompt
- **After**: References `$('Load External Prompts').item.json.prompts.openaiGeneration`

#### 3. Translate to Russian
- **Before**: 3,500-char embedded translation prompt
- **After**: References `$('Load External Prompts').item.json.prompts.russianTranslation`

#### 4. Humanize Russian Text
- **Before**: 2,300-char embedded humanization prompt
- **After**: References `$('Load External Prompts').item.json.prompts.russianHumanization`

### Connection Updates

```
Old Flow:
Parse Telegram Input → Route Decision → ...

New Flow:
Parse Telegram Input → Load External Prompts → Route Decision → ...
```

## How to Update Prompts

### Method 1: Direct File Edit (Recommended)

1. **Edit prompt files locally**:
   ```bash
   cd prompts/
   # Edit the prompt file
   nano openai-generation.md
   ```

2. **Commit and push to GitHub**:
   ```bash
   git add prompts/openai-generation.md
   git commit -m "Update case study generation prompt"
   git push origin main
   ```

3. **Prompts update automatically**: Next workflow execution will load the new prompt from GitHub.

### Method 2: GitHub Web Interface

1. Navigate to `prompts/` folder in GitHub
2. Click on the prompt file (e.g., `openai-generation.md`)
3. Click the "Edit" (pencil) icon
4. Make changes
5. Commit changes directly to `main` branch

### Method 3: A/B Testing with Branches

1. **Create experimental branch**:
   ```bash
   git checkout -b experimental
   # Edit prompts
   git add prompts/
   git commit -m "Experimental prompt changes"
   git push origin experimental
   ```

2. **Update workflow to use experimental branch**:
   - Edit "Load External Prompts" node
   - Change `PROMPT_VERSION` from `'main'` to `'experimental'`
   - Or use conditional logic for A/B testing

3. **Test and compare results**

4. **Merge to main when satisfied**:
   ```bash
   git checkout main
   git merge experimental
   git push origin main
   ```

## A/B Testing Strategies

### Strategy 1: Branch-Based Testing

**Edit "Load External Prompts" node:**

```javascript
// Test different prompt versions via branches
const PROMPT_VERSION = 'main';  // or 'experimental'
const GITHUB_BASE_URL = `https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/${PROMPT_VERSION}/prompts`;
```

### Strategy 2: User-Based Testing

```javascript
// 50% of users get experimental prompts
const PROMPT_VERSION = (Math.random() > 0.5) ? 'main' : 'experimental';
```

### Strategy 3: Specific User Testing

```javascript
// Specific users get experimental prompts
const testUserIds = [123456789, 987654321]; // Your Telegram user IDs
const PROMPT_VERSION = testUserIds.includes($input.item.json.userId) ? 'experimental' : 'main';
```

### Strategy 4: Feature Flag Testing

```javascript
// Individual prompt version control
const FEATURE_FLAGS = {
  useNewPerplexityPrompt: true,
  useNewGenerationPrompt: false,
  useNewTranslationPrompt: false,
  useNewHumanizationPrompt: true
};

// Load specific versions
const promptUrls = {
  perplexityResearch: FEATURE_FLAGS.useNewPerplexityPrompt
    ? `${GITHUB_BASE_URL}/perplexity-research-v2.md`
    : `${GITHUB_BASE_URL}/perplexity-research.md`,
  // ... etc
};
```

## Performance & Caching

### Current Implementation
- Prompts loaded fresh on every workflow execution
- ~1-2 second latency for GitHub fetch
- 4 separate HTTP requests to GitHub

### Optional: Enable Caching

**Add to "Load External Prompts" node for better performance:**

```javascript
// Cache prompts for 5 minutes in workflow static data
const cachedPrompts = $workflow.staticData.promptCache;
const cacheExpiry = $workflow.staticData.promptCacheExpiry;

if (cachedPrompts && cacheExpiry && Date.now() < cacheExpiry) {
  console.log('✅ Using cached prompts');
  return {
    json: {
      ...inputData,
      prompts: cachedPrompts,
      promptsLoaded: true,
      promptVersion: 'cached'
    }
  };
}

// Load fresh prompts
const prompts = await loadPrompts();

// Cache for 5 minutes
$workflow.staticData.promptCache = prompts;
$workflow.staticData.promptCacheExpiry = Date.now() + (5 * 60 * 1000);
```

**Benefits:**
- Reduces GitHub API calls by 95%
- Faster workflow execution (~1-2 seconds saved)
- Avoids GitHub rate limiting

## Troubleshooting

### Issue: Prompts not loading from GitHub

**Symptoms:**
- Workflow execution shows error in "Load External Prompts" node
- Error message: "Failed to load prompts"

**Solutions:**
1. **Check GitHub URLs**: Ensure URLs are correct and repository is public
2. **Check GitHub rate limit**: Max 60 requests/hour unauthenticated
3. **Check network connectivity**: n8n instance must have internet access
4. **Use fallback prompts**: Workflow automatically falls back to embedded prompts

### Issue: GitHub rate limiting

**Symptoms:**
- Error: "API rate limit exceeded"
- Occurs with high workflow execution volume

**Solutions:**
1. **Enable caching** (see Performance section above)
2. **Use GitHub authentication**: Add Personal Access Token for 5,000 requests/hour
3. **Use alternative hosting**: Host prompts on S3, CDN, or self-hosted server

### Issue: Workflow uses old prompts after update

**Symptoms:**
- Changed prompt on GitHub but workflow still uses old version

**Solutions:**
1. **Clear n8n cache**: Restart n8n workflow
2. **Check branch**: Ensure workflow is loading from correct branch
3. **Check caching**: If caching enabled, wait for cache expiry or clear static data
4. **Verify GitHub commit**: Ensure changes were committed and pushed

### Issue: One prompt fails to load

**Symptoms:**
- Execution log shows error for specific prompt
- Other prompts load successfully

**Solutions:**
1. **Check filename**: Ensure filename matches exactly (case-sensitive)
2. **Check file path**: Verify prompt is in `prompts/` directory
3. **Check file format**: Must be plain text `.md` file
4. **Use fallback**: Workflow will use embedded fallback for that prompt

## Monitoring & Analytics

### Check Prompt Loading Status

**In n8n execution logs, look for:**

```
✅ Prompts loaded successfully: {
  version: "main",
  timestamp: "2024-11-20T10:30:00.000Z",
  userId: 123456789,
  userName: "Test User"
}
```

### Track Prompt Performance

**Add logging to "Validate Russian Case Study" node:**

```javascript
console.log('Case Study Quality:', {
  promptVersion: $('Load External Prompts').item.json.promptVersion,
  validations: validations,
  passRate: passRate,
  executionTime: Date.now() - new Date($('Parse Telegram Input').item.json.timestamp)
});
```

## Best Practices

### 1. Version Control
- Use semantic versioning for prompt files (e.g., `openai-generation-v2.1.md`)
- Tag releases in Git: `git tag v2.1.0 && git push --tags`
- Keep changelog of prompt modifications

### 2. Testing
- Always test prompt changes in `experimental` branch first
- Use A/B testing for major prompt rewrites
- Monitor quality metrics before/after prompt changes

### 3. Documentation
- Add comments to prompt files explaining rationale
- Document expected outcomes for each prompt
- Keep examples of good vs. bad outputs

### 4. Backup
- Keep backup of working prompts
- Store previous versions in Git history
- Test fallback prompts periodically

### 5. Security
- Keep repository public OR use GitHub authentication
- Don't store API keys in prompts
- Sanitize user input before passing to prompts

## Migration from v2.0.0 to v2.1.0

### Quick Migration Steps

1. **Backup current workflow**:
   ```bash
   cp workflow/ddvb-case-study-generator.json workflow/ddvb-case-study-generator-v2.0.0-backup.json
   ```

2. **Import new workflow**:
   - In n8n, deactivate old workflow
   - Import `workflow/ddvb-case-study-generator.json` (v2.1.0)
   - Update GitHub URLs in "Load External Prompts" node
   - Activate new workflow

3. **Test thoroughly**:
   - Send test message
   - Verify prompts load from GitHub
   - Confirm case study quality unchanged

4. **Monitor for 24 hours**:
   - Check execution logs
   - Verify no errors
   - Compare output quality

### Rollback Plan

**If issues occur:**

1. **Deactivate v2.1.0 workflow**
2. **Import v2.0.0 backup**
3. **Activate backup workflow**
4. **Investigate issues**
5. **Fix and re-test v2.1.0**

## Support

### Getting Help

**If you encounter issues:**

1. Check this guide's Troubleshooting section
2. Review n8n execution logs
3. Verify GitHub repository accessibility
4. Test prompt URLs in browser

### Useful Resources

- **n8n Documentation**: https://docs.n8n.io/
- **GitHub Raw URLs**: https://docs.github.com/en/repositories/working-with-files/using-files/viewing-a-file
- **Prompt Engineering Guide**: https://www.promptingguide.ai/

## Appendix: Prompt File Formats

### Example Prompt Structure

```markdown
# Prompt Title

Brief description of what this prompt does.

## Section 1: Context

Provide context...

## Section 2: Instructions

Specific instructions...

## Section 3: Examples

Good examples...

## Section 4: Output Format

Expected output format...
```

### Prompt Metadata

**Add to top of each prompt file:**

```markdown
<!--
Prompt: OpenAI Case Study Generation
Version: 2.1.0
Last Updated: 2024-11-20
Author: DDVB Team
Purpose: Generate English case studies for Russian translation
Model: gpt-4o
Temperature: 0.8
Max Tokens: 2500
-->
```

## Changelog

### v2.1.0 (2024-11-20)
- ✅ Externalized all 4 prompts to separate `.md` files
- ✅ Added "Load External Prompts" node
- ✅ Implemented GitHub-based prompt loading
- ✅ Added automatic fallback mechanism
- ✅ Support for A/B testing via branches
- ✅ Created comprehensive documentation

### v2.0.0 (2024-11-19)
- Initial release with embedded prompts
- English-first generation architecture
- Russian translation and humanization
