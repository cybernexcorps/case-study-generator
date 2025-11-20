# DDVB Case Study Generator - Prompts

This directory contains all externalized prompts used in the n8n workflow for generating Russian case studies.

## Files

### 1. `perplexity-research.md`
**Purpose**: Strategic research prompt for Perplexity API
**Used in**: Perplexity Research node
**Model**: llama-3.1-sonar-large-128k-online
**Temperature**: 0.3
**Max Tokens**: 1000

Translates Russian user requests to English and researches company background, industry context, and business drivers.

### 2. `openai-generation.md`
**Purpose**: English case study generation prompt
**Used in**: Prepare OpenAI Request → Generate English Case Study nodes
**Model**: gpt-4o
**Temperature**: 0.8
**Max Tokens**: 2500

Generates complete case studies in English following SITUATION-TASK-SOLUTION structure with client and agency quotes.

### 3. `russian-translation.md`
**Purpose**: English to Russian translation with editorial standards
**Used in**: Translate to Russian node
**Model**: gpt-4o
**Temperature**: 0.3
**Max Tokens**: 2500

Translates English case studies to Russian following strict media editorial standards (Sostav.ru, Forbes Russia, RBC).

### 4. `russian-humanization.md`
**Purpose**: AI text humanization for Russian content
**Used in**: Humanize Russian Text node
**Model**: gpt-4o
**Temperature**: 0.7
**Max Tokens**: 2500

Removes AI patterns from Russian text while preserving facts, DDVB branding, and editorial standards.

## Configuration

See `prompt-config.json` for complete configuration including:
- Prompt file mappings
- Model settings
- Source URLs (GitHub, S3, local)
- Version tracking

## How to Update Prompts

### Quick Update (GitHub Web Interface)

1. Navigate to this directory in GitHub
2. Click on the prompt file you want to edit
3. Click the pencil icon (Edit)
4. Make your changes
5. Commit directly to `main` branch
6. Next workflow execution will use updated prompt

### Local Update (Git)

1. Edit prompt file locally:
   ```bash
   cd prompts/
   nano openai-generation.md
   ```

2. Test changes locally (optional)

3. Commit and push:
   ```bash
   git add openai-generation.md
   git commit -m "Update: improve quote generation logic"
   git push origin main
   ```

4. Changes take effect on next workflow execution

### A/B Testing

1. Create experimental branch:
   ```bash
   git checkout -b experimental
   ```

2. Edit prompts:
   ```bash
   nano openai-generation.md
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Experimental: test new prompt structure"
   git push origin experimental
   ```

4. Update n8n workflow to use experimental branch:
   - Edit "Load External Prompts" node
   - Change `PROMPT_VERSION` to `'experimental'`
   - Or use conditional logic for A/B testing

5. Compare results

6. Merge if successful:
   ```bash
   git checkout main
   git merge experimental
   git push origin main
   ```

## Prompt Writing Guidelines

### Structure

Each prompt should include:
1. **Role/Identity**: Who is the AI acting as?
2. **Context**: What is the scenario?
3. **Task**: What should the AI do?
4. **Constraints**: What are the limitations?
5. **Output Format**: How should the response be structured?
6. **Examples**: Show good vs. bad outputs

### Best Practices

- **Be Specific**: Vague instructions produce vague outputs
- **Use Examples**: Show exactly what you want
- **Set Constraints**: Define boundaries and limits
- **Test Iteratively**: Start simple, add complexity gradually
- **Version Control**: Keep track of what works

### Testing Prompts

Before committing major prompt changes:

1. **Test in Playground**: Use OpenAI/Perplexity playground
2. **Test in Workflow**: Send test message to Telegram bot
3. **Compare Outputs**: Side-by-side comparison of old vs. new
4. **Validate Quality**: Check against Russian media standards
5. **Get Feedback**: Review with team before merging

## Prompt Versioning

### Semantic Versioning

Use semantic versioning for major prompt updates:

- `v1.0.0`: Initial version
- `v1.1.0`: Minor improvements (better examples, clearer instructions)
- `v2.0.0`: Major rewrites (new structure, different approach)

### File Naming Conventions

For versioned prompts, use:
- `openai-generation.md` (current/production)
- `openai-generation-v2.md` (specific version)
- `openai-generation-experimental.md` (experimental)

### Git Tags

Tag important prompt versions:

```bash
git tag prompts-v2.1.0 -m "Improved quote generation and DDVB branding"
git push --tags
```

## Monitoring Prompt Performance

### Key Metrics to Track

1. **Quality Metrics**:
   - Validation pass rate
   - Manual review scores
   - User satisfaction

2. **Performance Metrics**:
   - Average token usage
   - API response time
   - Cost per execution

3. **Business Metrics**:
   - Case studies published
   - Publications accepted
   - DDVB brand mentions

### Logging

Add logging to track prompt performance:

```javascript
// In workflow validation node
console.log('Prompt Performance:', {
  promptVersion: $('Load External Prompts').item.json.promptVersion,
  validationPassRate: passRate,
  tokensUsed: estimatedTokens,
  executionTime: executionTimeMs
});
```

## Common Issues & Solutions

### Issue: Prompt too long

**Symptoms**: Token limit exceeded, high API costs

**Solutions**:
- Remove redundant examples
- Consolidate similar instructions
- Move reference material to external links
- Use more concise language

### Issue: Inconsistent outputs

**Symptoms**: Quality varies significantly between executions

**Solutions**:
- Lower temperature (0.3-0.5 for consistency)
- Add more specific constraints
- Provide clearer examples
- Use structured output formats

### Issue: AI ignores instructions

**Symptoms**: Output doesn't follow specified format

**Solutions**:
- Make instructions more explicit
- Repeat critical requirements
- Use negative examples (what NOT to do)
- Add validation checkpoints

### Issue: Outputs too generic

**Symptoms**: Text sounds robotic or formulaic

**Solutions**:
- Add personality/voice guidelines
- Provide diverse examples
- Encourage variation
- Balance structure with creativity

## Backup & Recovery

### Automatic Backups

Git automatically maintains history:

```bash
# View prompt history
git log prompts/openai-generation.md

# Restore previous version
git checkout HEAD~1 prompts/openai-generation.md
git commit -m "Rollback: revert to previous prompt version"
```

### Manual Backups

Before major changes:

```bash
cp openai-generation.md openai-generation.backup.md
git add openai-generation.backup.md
git commit -m "Backup: save working prompt before experiment"
```

## Resources

### Prompt Engineering

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Prompting Guide](https://www.promptingguide.ai/)

### Russian Media Standards

- [Sostav.ru Editorial Guidelines](https://www.sostav.ru/)
- [Russian Typography Rules](https://www.artlebedev.ru/typograf/)
- [Glavred Writing Guide](https://glvrd.ru/)

### Tools

- [OpenAI Playground](https://platform.openai.com/playground)
- [Perplexity AI](https://www.perplexity.ai/)
- [AI Text Detection](https://writer.com/ai-content-detector/)

## Changelog

### 2024-11-20
- ✅ Externalized all prompts from workflow JSON
- ✅ Created structured prompt files
- ✅ Added configuration and documentation
- ✅ Implemented GitHub-based loading

### Future Improvements

- [ ] Add prompt templates for different publication types
- [ ] Create prompt testing suite
- [ ] Implement automated quality scoring
- [ ] Add multilingual support (English publications)
- [ ] Build prompt analytics dashboard
