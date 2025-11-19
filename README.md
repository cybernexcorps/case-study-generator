# DDVB Case Study Generator - n8n Workflow

AI-powered workflow for generating publication-ready case studies in Russian for DDVB branding agency.

## Overview

This n8n workflow acts as Ilya Morozov, Senior PR Executive at DDVB, creating professional case studies that showcase DDVB's branding work. All case studies are generated in Russian following strict editorial standards for Russian media outlets.

## Features

- **Chat Interface**: Interactive conversation in Russian to gather case study requirements
- **Russian Language**: All communication and case studies in Russian only
- **AI-Powered Research**: Uses Perplexity API to research companies, industries, and context
- **Professional Generation**: Uses OpenAI GPT-4o to create publication-ready content
- **Russian Media Standards**: Follows strict СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure with character limits
- **Email Delivery**: Sends completed case studies with metadata packages

## Workflow Components

### 1. Chat Trigger
- Receives user messages via n8n chat interface
- Handles multi-turn conversations for clarifying questions

### 2. Input Validation & Processing
- Validates input is in Russian
- Parses case study requirements
- Identifies missing information

### 3. Research Phase (Perplexity API)
- Researches company background
- Gathers industry context
- Finds competitive landscape information

### 4. Case Study Generation (OpenAI API)
- Generates Russian case studies following editorial standards
- Creates mandatory client and agency quotes (500-700 chars each)
- Produces metadata packages (SEO, keywords, social snippets)
- Ensures DDVB branding throughout

### 5. Quality Validation
- Validates character limits (title ≤90, text 1500-2000)
- Checks СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure
- Verifies Russian formatting («кавычки», em-dashes, number spacing)

### 6. Email Delivery
- Formats case study for email
- Includes complete Russian case study
- Adds metadata package and team composition section
- Sends to user's email

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
2. API credentials:
   - Perplexity API key
   - OpenAI API key (GPT-4o access)
   - SMTP credentials for email sending

### Setup

1. **Import Workflow**:
   ```bash
   # In n8n, go to Workflows → Import from File
   # Select: workflow/ddvb-case-study-generator.json
   ```

2. **Configure Credentials**:
   - Add Perplexity API credentials
   - Add OpenAI API credentials (ensure GPT-4o model access)
   - Add SMTP/Email credentials

3. **Configure Nodes**:
   - Update email recipient in the "Send Email" node
   - Adjust any custom settings as needed

4. **Activate Workflow**:
   - Enable the workflow in n8n
   - Test using the chat interface

## Usage

### Starting a Conversation

Trigger the chat interface and provide case study details in Russian:

**Пример:**
```
Создай кейс DDVB для Sostav.ru о ребрендинге крафтовой пивоварни "Хмель & Солод".
Продажи выросли на 45% после запуска новой айдентики от DDVB.
```

**Пример с подробностями:**
```
Нужен кейс для Forbes Russia о ребрендинге финтех-стартапа "FinTechPro".
После ребрендинга от DDVB компания привлекла инвестиции на $5 млн.
Проект включал разработку новой айдентики, нейминга и позиционирования.
```

### What to Include

Provide as much detail as possible:
- **Client name** and industry
- **Target publication** (Sostav.ru, Forbes Russia, RBC, VC.ru, etc.)
- **Project type** (branding, rebranding, packaging, naming, identity)
- **Business results** (metrics, growth percentages, timeframes)
- **Client quotes** (if available)
- **DDVB team members** involved
- **Deliverables** created

### Expected Output

You'll receive an email containing:

1. **Complete Russian Case Study**:
   - Professional title and subtitle
   - СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ narrative structure
   - Client and agency quotes
   - Team composition section

2. **Metadata Package** (in Russian):
   - SEO title tag and meta description
   - Primary and secondary keywords
   - Social media snippets (VK, Telegram, LinkedIn)
   - Pull quotes with attribution
   - Asset recommendations

3. **Publication Notes**:
   - Guidance for editors
   - Adaptation suggestions

## File Structure

```
case-study-generator/
├── README.md                          # This file
├── workflow/
│   └── ddvb-case-study-generator.json # Main n8n workflow
├── prompts/
│   ├── system-prompt.md               # Complete system instructions
│   ├── reference-examples.md          # Case study examples
│   └── editorial-standards.md         # Russian media standards
└── docs/
    ├── setup-guide.md                 # Detailed setup instructions
    └── customization.md               # How to customize the workflow
```

## Customization

### Changing PR Executive Name

Edit the system prompt in the OpenAI node to replace "Ilya Morozov" with another team member.

### Adding DDVB Methodology

Update the system prompt to include specific DDVB frameworks, processes, or proprietary tools.

### Target Publications

The workflow adapts content for:
- Russian trade press (Sostav.ru, Cossa.ru, Adindex)
- Business media (Forbes Russia, RBC, VC.ru)
- Design communities (Behance Russia, DesignDepot)
- Industry journals (РЖМ, Маркетинг в России)

## Quality Assurance

Every generated case study is validated for:

✅ Russian language and formatting compliance
✅ Character limits (title, text, total)
✅ СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure
✅ Mandatory quotes from both perspectives
✅ DDVB branding integration
✅ Publication-appropriate tone

## Troubleshooting

### Common Issues

**Case study not in Russian:**
- Check OpenAI node configuration
- Verify system prompt includes "CRITICAL: ALL case study outputs must be written in RUSSIAN"

**Missing quotes:**
- System should generate quotes if not provided
- Check OpenAI temperature settings (recommended: 0.7-0.9)

**Email not sending:**
- Verify SMTP credentials
- Check email address format in Send Email node

**API errors:**
- Confirm API keys are valid and have quota
- Check model availability (GPT-4o for OpenAI)

## Support

For issues or questions:
- Check n8n logs for error messages
- Review API quota and limits
- Verify all credentials are properly configured

## License

Proprietary - DDVB Agency

## Version

- **Version**: 1.0.0
- **Created**: November 2024
- **n8n Version**: Compatible with n8n 1.0+
- **Optimized for**: n8n Cloud
