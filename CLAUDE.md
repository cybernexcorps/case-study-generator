# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered Telegram bot for generating publication-ready case studies in Russian for DDVB branding agency. The system uses n8n workflow automation with AI (Perplexity for research, OpenAI GPT-4o for generation/translation) to create professional case studies following strict Russian media editorial standards.

**Key Architecture Pattern**: English-first generation with professional Russian translation and AI humanization.

## High-Level Architecture

### Workflow Flow (Telegram Bot)
```
Telegram Message (Russian input)
  ↓
Parse & Validate Russian Input
  ↓
Research (Perplexity) - Structured strategic analysis
  ↓
Generate Case Study in English (GPT-4o)
  ↓
Translate to Russian (GPT-4o + editorial standards)
  ↓
Humanize Russian Text (GPT-4o removes AI patterns)
  ↓
Validate Quality
  ↓
Send to Telegram
```

### Why English-First Generation?
- **Better AI Quality**: GPT-4o produces more consistent, high-quality content in English
- **Better Quote Handling**: English generation handles nuanced quotes more naturally
- **Specialized Translation**: Dedicated translation step enforces proper Russian formatting («кавычки», em-dashes, number spacing)
- **Terminology Control**: Translation prompt enforces correct брендинг terminology
- **AI Humanization**: Post-translation pass removes robotic language patterns while preserving facts and DDVB branding

## Critical Russian Media Standards

All case studies MUST comply with these strict editorial requirements:

### Structure (max 3,000 characters total)
- **Title**: ≤90 chars, active voice, NEVER start with preposition/number
- **Subtitle**: 1-2 sentences, expands title (no duplication)
- **Main Text**: 1,500-2,000 chars following СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ (Situation-Task-Solution)
- **Quotes**: BOTH client AND agency (500-700 chars each) - MANDATORY
- **Team Composition**: Hierarchical listing of DDVB team then client team

### Russian Formatting (non-negotiable)
- Russian quotation marks: «кавычки» (NOT "quotes")
- Em-dashes without spaces: текст—продолжение
- Numbers: 10 000 (space separator, NOT 10,000)
- Eliminate канцелярит (bureaucratic language)
- Explain ALL abbreviations on first use

## File Structure

```
case-study-generator/
├── workflow/
│   └── ddvb-case-study-generator.json   # n8n workflow definition
├── prompts/
│   ├── system-prompt.md                 # English generation prompt
│   ├── editorial-standards.md           # Russian media requirements
│   └── reference-examples.md            # Russian case study examples
└── docs/
    ├── setup-guide.md                   # Deployment instructions
    └── customization.md                 # Modification guide
```

## Working with n8n Workflows

### Importing/Exporting
```bash
# In n8n UI:
# Workflows → Import from File → Select workflow/ddvb-case-study-generator.json
# Workflows → Export → Download as JSON
```

### Key Workflow Nodes
1. **Telegram Trigger**: Webhook-based message listener
2. **Parse Telegram Input**: JavaScript code node validating Russian input
3. **Perplexity Research**: HTTP request to Perplexity API
4. **Generate English Case Study**: OpenAI GPT-4o with comprehensive prompt
5. **Translate to Russian**: OpenAI GPT-4o with editorial standards
6. **Humanize Russian Text**: OpenAI GPT-4o removes AI patterns
7. **Validate Quality**: JavaScript code checking compliance
8. **Send to Telegram**: Delivers final Russian case study

### Testing Workflow Changes
Send test message to Telegram bot in Russian:
```
Создай кейс DDVB для Sostav.ru о ребрендинге крафтовой пивоварни "Хмель & Солод".
Продажи выросли на 45% после запуска новой айдентики от DDVB.
```

## Customization Points

### Changing PR Executive
Edit `prompts/system-prompt.md` line 7:
```
Вы — Илья Морозов, старший PR-менеджер в DDVB...
```

### Modifying AI Behavior
In OpenAI nodes within workflow JSON:
- **Temperature**: 0.3 (research) / 0.8 (generation) - adjust for consistency vs creativity
- **Max Tokens**: 1000 (research) / 4000 (generation) - impacts length and cost
- **Model**: "gpt-4o" (recommended) / "gpt-4-turbo" (faster) / "gpt-4" (slower)

### Adding Publications
Update system prompt with publication profiles (Sostav.ru, Forbes Russia, RBC, VC.ru, etc.) and detection logic in Parse Input node.

## Prompt Architecture

### System Prompt Structure (prompts/system-prompt.md)
1. **Core Identity**: PR Executive persona (Ilya Morozov, DDVB)
2. **Agency Information**: Services, methodology, positioning
3. **Editorial Standards**: Embedded Russian media requirements
4. **Quality Checklist**: Pre-flight validation criteria
5. **Response Structure**: Sections to generate

### Translation Prompt (embedded in workflow)
- Enforces Russian quotation marks and formatting
- Applies proper брендинг terminology
- Maintains СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure
- Eliminates канцелярит

### Humanization Prompt (embedded in workflow)
- Removes AI patterns (repetitive structures, robotic phrasing)
- Varies sentence lengths and structures naturally
- Preserves all facts, metrics, and DDVB branding
- Maintains Russian media standards

## Common Modifications

### Update DDVB Services
Edit `prompts/system-prompt.md` lines 15-24 to add/modify:
- Brand services (e.g., Motion Design, Digital Strategy)
- Methodology frameworks
- Awards and credentials

### Add Validation Rules
Edit "Validate Quality" node JavaScript:
```javascript
const validations = {
  titleLength: sections.title.length <= 90,
  hasMinQuotes: sections.quotes.length >= 2,
  textLength: sections.fullText.length >= 1500 && sections.fullText.length <= 3000,
  hasRussianText: /[А-Яа-яЁё]/.test(sections.fullText),
  hasProperQuotes: /«.*»/.test(sections.fullText),
  // Add custom rules here
};
```

### Adjust Character Limits
Modify validation thresholds in workflow based on target publication requirements (some publications accept longer/shorter formats).

## API Dependencies

### Required Credentials
1. **Telegram Bot Token** (from @BotFather)
2. **Perplexity API Key** (research/translation capabilities)
3. **OpenAI API Key** (GPT-4o access required)

### Credential Configuration
Configure in n8n: Credentials → Add Credential → Select type → Enter key

## Quality Assurance

### Pre-Deployment Checklist
- [ ] Test with Russian input (minimum viable: client name + project type)
- [ ] Verify Russian quotation marks «» appear correctly
- [ ] Confirm both client AND agency quotes generated
- [ ] Check СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure present
- [ ] Validate character limits (title ≤90, text 1500-2000)
- [ ] Ensure DDVB branding appears naturally throughout
- [ ] Test Telegram delivery works

### Monitoring
- Check n8n execution logs for errors
- Monitor API token usage (Perplexity + OpenAI)
- Track case study quality scores
- Review Telegram delivery success rate

## Key Design Decisions

### Russian Input → English Generation → Russian Translation
This multi-stage approach provides:
- Natural input method for Russian PR team
- Superior AI generation quality in English
- Precise control over Russian formatting via translation
- Consistency in applying Russian media standards
- AI humanization removes unnatural patterns

### Mandatory Quote Generation
If user doesn't provide quotes, system MUST generate appropriate quotes based on case context - this is non-negotiable for Russian media publications.

### Perplexity for Research
Perplexity handles company background research and strategic context, reducing hallucination risk in case study generation.

## Troubleshooting

### Bot Not Responding
1. Check workflow is **Activated** (toggle in n8n)
2. Verify Telegram credentials correct
3. Check webhook registration successful

### Russian Formatting Issues
1. Review translation prompt emphasizes «кавычки»
2. Check validation logic in "Validate Quality" node
3. Verify GPT-4o (not GPT-3.5) being used

### Validation Failing
1. Review character counts in validation node
2. Check СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure detection
3. Ensure both quotes present (client + agency)

### AI Humanization Not Effective
1. Adjust temperature in humanization node (try 0.7-0.9)
2. Review humanization prompt for clarity
3. Consider adding specific pattern examples to avoid

## Development Workflow

1. **Modify prompts**: Edit `.md` files in `prompts/`
2. **Update workflow**: Import JSON → Edit nodes → Export JSON
3. **Test locally**: Use Telegram bot test messages
4. **Monitor execution**: Check n8n execution history
5. **Iterate**: Adjust based on output quality

## Version History
- **v2.1.0** (Nov 2024): Added AI humanization step
- **v2.0.0** (Nov 2024): Rebuilt with English-first generation + Russian translation
- **v1.0.0**: Initial Telegram bot workflow
