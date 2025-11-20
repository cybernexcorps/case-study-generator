# DDVB Case Study Generator - n8n Workflow

AI-powered Telegram bot for generating publication-ready case studies in Russian for DDVB branding agency.

## Overview

This n8n workflow acts as Ilya Morozov, Senior PR Executive at DDVB, creating professional case studies via Telegram. Case studies are generated in English first, then professionally translated to Russian following strict editorial standards for Russian media outlets.

## Features

- **Telegram Bot Interface**: Interact via Telegram messenger
- **Russian Input**: Send requests in Russian via Telegram (natural for Russian PR team)
- **AI-Powered Research**: Uses Perplexity API for structured strategic research and company analysis
- **English Generation**: Internally generates case study in English first with comprehensive reference examples (better AI quality)
- **Professional Translation**: Translates to Russian with detailed editorial standards and proper formatting
- **AI Humanization**: Post-translation humanization pass to make text sound natural and human-written
- **Russian Media Standards**: Follows strict СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure with character limits
- **Telegram Delivery**: Receives completed Russian case study directly in Telegram

## Workflow Architecture

```
Telegram Message (Russian input from user)
    ↓
Validate Russian Input & Parse Entities
    ↓
Research (Perplexity) - Structured strategic analysis
    ↓
Generate Case Study in English (OpenAI GPT-4o)
    ↓
Translate to Russian (OpenAI GPT-4o with detailed editorial standards)
    ↓
Humanize Russian Text (OpenAI GPT-4o to remove AI patterns)
    ↓
Validate Russian Quality - Check standards compliance
    ↓
Send to Telegram - Deliver humanized Russian case study
```

## Workflow Components

### 1. Telegram Trigger
- Listens for messages from Telegram bot
- Webhook-based activation

### 2. Parse Telegram Input
- Extracts message text and chat ID
- Parses case study requirements
- Identifies missing information

### 3. Research Phase (Perplexity API)
- Translates Russian request to English
- Researches company background, industry context, and competitive landscape
- Provides structured research output with:
  - Company background and market position
  - Brand and market context
  - Industry insights and trends
  - Potential project drivers and challenges

### 4. English Case Study Generation (OpenAI GPT-4o)
- Generates case study in English following comprehensive reference examples
- Follows SITUATION-TASK-SOLUTION structure
- Creates mandatory client and agency quotes (500-700 chars each)
- Integrates DDVB branding naturally throughout
- Produces metadata in English (SEO tags, keywords, pull quotes)

### 5. Translation to Russian (OpenAI GPT-4o)
- Professional translation with detailed Russian media editorial standards
- Applies proper Russian formatting («кавычки», em-dashes, number spacing)
- Uses correct branding terminology (брендинг, айдентика, нейминг, etc.)
- Maintains СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure
- Eliminates канцелярит (bureaucratic language)

### 6. AI Humanization (OpenAI GPT-4o)
- Post-translation pass to remove AI patterns
- Makes text sound natural and human-written
- Varies sentence structures and lengths
- Removes robotic phrasing while preserving all facts
- Maintains Russian media standards and DDVB branding

### 7. Quality Validation
- Validates character limits (title ≤90, text 1500-2000)
- Checks СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure
- Verifies Russian formatting («кавычки», em-dashes, number spacing)
- Confirms DDVB branding integration

### 8. Telegram Delivery
- Sends humanized Russian case study to user's Telegram chat
- Includes validation results
- Formatted with Markdown

## Russian Media Editorial Standards

All case studies comply with:

- **Title**: ≤90 characters, active voice, no preposition/number at start
- **Subtitle**: Expands title (1-2 sentences, no duplication)
- **Main Text**: 1,500-2,000 characters
- **Structure**: СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ (Situation-Task-Solution)
- **Quotes**: Both client AND agency (500-700 chars each)
- **Total Length**: ≤3,000 characters
- **Formatting**: Russian quotation marks «», em-dashes (—), numbers "10 000"
- **Language**: Clear, active Russian eliminating канцелярит (bureaucratic language)

## Installation

### Prerequisites

1. n8n Cloud account or self-hosted n8n instance
2. Telegram Bot Token (from @BotFather)
3. API credentials:
   - Perplexity API key
   - OpenAI API key (GPT-4o access)

### Setup

1. **Create Telegram Bot**:
   - Message @BotFather on Telegram
   - Use `/newbot` command
   - Follow instructions to get bot token

2. **Import Workflow**:
   ```bash
   # In n8n, go to Workflows → Import from File
   # Select: workflow/ddvb-case-study-generator.json
   ```

3. **Configure Credentials**:
   - Add Telegram Bot credentials (bot token)
   - Add Perplexity API credentials
   - Add OpenAI API credentials (ensure GPT-4o model access)

4. **Activate Workflow**:
   - Enable the workflow in n8n
   - Telegram bot will start listening for messages

## Usage

### Starting a Conversation

Send a message to your Telegram bot in Russian:

**Пример:**
```
Создай кейс DDVB для Sostav.ru о ребрендинге крафтовой пивоварни "Хмель & Солод".
Продажи выросли на 45% после запуска новой айдентики от DDVB.
```

**Подробный пример:**
```
Нужен кейс для Forbes Russia о ребрендинге финтех-стартапа "FinTechPro".
После ребрендинга от DDVB компания привлекла инвестиции на $5 млн.
Проект включал разработку новой айдентики, нейминга и позиционирования.
```

### What to Include

Provide as much detail as possible in Russian:
- **Client name** and industry
- **Target publication** (Sostav.ru, Forbes Russia, RBC, VC.ru, etc.)
- **Project type** (branding, rebranding, packaging, naming, identity)
- **Business results** (metrics, growth percentages, timeframes)
- **Client quotes** (if available)
- **DDVB team members** involved
- **Deliverables** created

### Expected Output

You'll receive a Telegram message containing:

1. **Complete Russian Case Study**:
   - Professional title and subtitle
   - СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ narrative structure
   - Client and agency quotes
   - Team composition section

2. **Validation Status**:
   - Quality check results
   - Standards compliance confirmation

## File Structure

```
case-study-generator/
├── README.md                          # This file
├── QUICKSTART.md                      # 10-minute setup guide
├── workflow/
│   └── ddvb-case-study-generator.json # Main n8n workflow (Telegram-based)
├── prompts/
│   ├── system-prompt.md               # Complete English system prompt
│   ├── translation-prompt.md          # Russian translation guidelines
│   ├── reference-examples.md          # Russian case study examples
│   └── editorial-standards.md         # Russian media standards
└── docs/
    ├── setup-guide.md                 # Detailed setup instructions
    └── customization.md               # How to customize the workflow
```

## How It Works

### Russian Input with English-First Generation

1. **User sends request in Russian** via Telegram (natural for Russian PR team)
2. **Perplexity translates & researches** - structured strategic analysis in English
   - Company background and market position
   - Brand context and target audience
   - Industry trends and competitive landscape
3. **Generate case study in English** using OpenAI GPT-4o
   - Accepts Russian input but generates in English
   - Better AI quality and structure in English
   - Better handling of quotes and nuance
   - Follows comprehensive reference examples
4. **Translate to Russian** using specialized translation prompt
   - Professional translation with detailed editorial standards
   - Proper Russian formatting and terminology
   - СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure maintained
   - Eliminates канцелярит (bureaucratic language)
5. **Humanize Russian text** using AI post-processing
   - Removes AI patterns and robotic phrasing
   - Varies sentence structures naturally
   - Makes text sound human-written
   - Preserves all facts and DDVB branding
6. **Validate Russian output** for quality and standards compliance
7. **Deliver via Telegram** in Russian

### Why English-First Generation with Humanization?

- **Better Quality**: AI generates more consistent, high-quality content in English
- **Natural Input**: Users write in Russian (their native language)
- **Specialized Translation**: Dedicated translation step ensures proper Russian formatting
- **Terminology Control**: Translation prompt enforces correct брендинг terminology
- **Structure Preservation**: SITUATION-TASK-SOLUTION translates cleanly to СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ
- **AI Humanization**: Post-translation pass removes AI patterns and robotic language
- **Natural Output**: Final text sounds human-written, not AI-generated
- **Best of Both**: Russian input comfort + English generation quality + human-like output

## Telegram Bot Commands

Once your bot is active, users can:

- Send case study requests in Russian (plain text, natural language)
- Receive Russian case studies instantly (generated via English for quality)
- No special commands needed - just describe the project in Russian

## Customization

### Changing PR Executive Name

Edit the system prompt in the "Prepare OpenAI Request" node to replace "Ilya Morozov" with another team member.

### Adding DDVB Methodology

Update the system prompt to include specific DDVB frameworks, processes, or proprietary tools.

### Target Publications

The workflow adapts content for:
- Russian trade press (Sostav.ru, Cossa.ru, Adindex)
- Business media (Forbes Russia, RBC, VC.ru)
- Design communities (Behance Russia, DesignDepot)
- Industry journals (РЖМ, Маркетинг в России)

## Troubleshooting

### Common Issues

**Bot not responding:**
- Check workflow is **Activated** (toggle ON)
- Verify Telegram credentials are correct
- Test bot with simple message first

**API errors:**
- Confirm API keys are correct
- Check API quota and billing status
- Verify GPT-4o access for OpenAI

**Translation quality issues:**
- Check translation prompt in "Translate to Russian" node
- Adjust temperature (lower = more consistent, higher = more creative)
- Verify Russian formatting requirements

**Case study structure problems:**
- Review English generation prompt
- Ensure SITUATION-TASK-SOLUTION structure is clear
- Check that quotes are being generated properly

## Support

For issues or questions:
- Check n8n logs for error messages
- Review API quota and limits
- Verify all credentials are properly configured

## License

Proprietary - DDVB Agency

## Version

- **Version**: 2.1.0
- **Created**: November 2024
- **Updated**: November 2024 (Added AI humanization step)
- **n8n Version**: Compatible with n8n 1.0+
- **Platform**: Telegram Bot + n8n Cloud
- **Architecture**: English-first generation with Russian translation and AI humanization
