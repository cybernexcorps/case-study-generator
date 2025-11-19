# DDVB Case Study Generator - n8n Workflow

AI-powered Telegram bot for generating publication-ready case studies in Russian for DDVB branding agency.

## Overview

This n8n workflow acts as Ilya Morozov, Senior PR Executive at DDVB, creating professional case studies via Telegram. Case studies are generated in English first, then professionally translated to Russian following strict editorial standards for Russian media outlets.

## Features

- **Telegram Bot Interface**: Interact via Telegram messenger
- **English Input**: Send requests in English via Telegram
- **AI-Powered Research**: Uses Perplexity API to research companies, industries, and context
- **English Generation**: Uses OpenAI GPT-4o to create case study in English first
- **Professional Translation**: Translates to Russian with proper formatting and terminology
- **Russian Media Standards**: Follows strict СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure with character limits
- **Telegram Delivery**: Receives completed Russian case study directly in Telegram

## Workflow Architecture

```
Telegram Message (English input)
    ↓
Parse Input & Extract Entities
    ↓
Research (Perplexity) - Get company background in English
    ↓
Generate Case Study in English (OpenAI GPT-4o)
    ↓
Translate to Russian (OpenAI GPT-4o with translation prompt)
    ↓
Validate Russian Quality - Check standards compliance
    ↓
Send to Telegram - Deliver Russian case study
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
- Researches company background in English
- Gathers industry context
- Finds competitive landscape information

### 4. English Case Study Generation (OpenAI GPT-4o)
- Generates case study in English
- Follows SITUATION-TASK-SOLUTION structure
- Creates mandatory client and agency quotes (500-700 chars each)
- Produces metadata in English

### 5. Translation to Russian (OpenAI GPT-4o)
- Professional translation with Russian media standards
- Applies proper Russian formatting («кавычки», em-dashes, number spacing)
- Uses correct branding terminology (брендинг, айдентика, etc.)
- Maintains СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure

### 6. Quality Validation
- Validates character limits (title ≤90, text 1500-2000)
- Checks СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure
- Verifies Russian formatting («кавычки», em-dashes, number spacing)
- Confirms DDVB branding integration

### 7. Telegram Delivery
- Sends Russian case study to user's Telegram chat
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

Send a message to your Telegram bot in English:

**Example:**
```
Create a DDVB case study for Sostav.ru about rebranding craft brewery "Hops & Malt".
Sales grew 45% after launching the new identity from DDVB.
```

**Detailed Example:**
```
Need a case study for Forbes Russia about rebranding fintech startup "FinTechPro".
After DDVB's rebrand, they attracted $5M investment.
Project included new brand identity, naming, and positioning.
```

### What to Include

Provide as much detail as possible in English:
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

### English-First Approach

1. **User sends request in English** via Telegram
2. **Research in English** using Perplexity API
3. **Generate case study in English** using OpenAI GPT-4o
   - Easier for AI to maintain quality and structure
   - Better handling of quotes and nuance
4. **Translate to Russian** using specialized translation prompt
   - Professional translation with media standards
   - Proper Russian formatting and terminology
   - СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure maintained
5. **Validate Russian output** for quality
6. **Deliver via Telegram** in Russian

### Why English-First?

- **Better Quality**: AI generates more consistent, high-quality content in English
- **Easier Editing**: English drafts easier to review and refine
- **Specialized Translation**: Dedicated translation step ensures proper Russian formatting
- **Terminology Control**: Translation prompt enforces correct брендинг terminology
- **Structure Preservation**: SITUATION-TASK-SOLUTION translates cleanly to СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ

## Telegram Bot Commands

Once your bot is active, users can:

- Send case study requests in plain English
- Receive Russian case studies instantly
- No special commands needed - just describe the project

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

- **Version**: 2.0.0
- **Created**: November 2024
- **n8n Version**: Compatible with n8n 1.0+
- **Platform**: Telegram Bot + n8n Cloud
- **Architecture**: English-first generation with Russian translation
