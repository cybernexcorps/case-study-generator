# Quick Start Guide

Get your DDVB Case Study Generator running in 10 minutes!

## What You'll Need

- ✅ n8n Cloud account (or self-hosted n8n)
- ✅ Perplexity API key
- ✅ OpenAI API key (with GPT-4o access)
- ✅ SMTP credentials (Gmail, Outlook, or custom)

## 5 Simple Steps

### 1️⃣ Import Workflow

1. Log into n8n Cloud
2. Go to **Workflows** → **Import from File**
3. Upload `workflow/ddvb-case-study-generator.json`

### 2️⃣ Add API Keys

Configure these credentials in n8n:

**Perplexity:**
- Type: Header Auth
- Header: `Authorization`
- Value: `Bearer YOUR_PERPLEXITY_KEY`

**OpenAI:**
- Type: OpenAI API
- API Key: `YOUR_OPENAI_KEY`

**SMTP (Email):**
- Gmail: smtp.gmail.com:587 (use App Password!)
- Outlook: smtp.office365.com:587

### 3️⃣ Link Credentials

1. Open imported workflow
2. Click each API node (Perplexity, OpenAI, Email)
3. Select your credentials from dropdown

### 4️⃣ Configure Email

In the **"Send Email"** node:
- Update "From Email" to your email
- Update "To Email" (or keep dynamic)

### 5️⃣ Activate & Test

1. Click **Activate** (toggle at top right)
2. Open the chat URL shown in Chat Trigger node
3. Test with (in Russian):
   ```
   Создай кейс DDVB для Sostav.ru о ребрендинге пивоварни "Хмель & Солод"
   ```

## Expected Result

You'll receive an email with:
- ✅ Complete Russian case study
- ✅ СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure
- ✅ Client and agency quotes
- ✅ Metadata package
- ✅ Team composition section

## What The Workflow Does

```
User Message (Chat)
    ↓
Language Detection (Russian/English)
    ↓
Research (Perplexity) - Get company background
    ↓
Generate Case Study (OpenAI) - Create Russian content
    ↓
Validate Quality - Check standards compliance
    ↓
Send Email - Deliver to user
    ↓
Chat Response - Confirm completion
```

## Key Features

🇷🇺 **Russian Language**
- All communication in Russian
- Input validation ensures Russian-only
- Case study in professional Russian

📊 **Research-Powered**
- Perplexity finds company info
- Industry context included
- Competitive landscape analyzed

✍️ **Professional Generation**
- GPT-4o creates publication-ready content
- Follows strict Russian media standards
- Includes mandatory client + agency quotes

✅ **Quality Validated**
- Character limits checked (title ≤90, text 1500-2000)
- Russian formatting verified («кавычки», em-dashes)
- DDVB branding confirmed

📧 **Email Delivery**
- Formatted HTML email
- Complete case study
- Metadata package included

## Troubleshooting

### Workflow not starting?
- Check if workflow is **Activated** (toggle ON)
- Verify Chat Trigger has valid webhook ID

### API errors?
- Confirm API keys are correct (no extra spaces)
- Check API quota/billing status
- Verify GPT-4o access for OpenAI

### Email not sending?
- Gmail users: Use **App Password**, not regular password
  - Go to: https://myaccount.google.com/apppasswords
- Check spam/junk folder
- Verify SMTP host and port are correct

### Case study not in Russian?
- Check OpenAI node has correct system prompt
- Verify temperature is 0.7-0.9
- Ensure GPT-4o model is selected

## Next Steps

📖 **Full Documentation:**
- [Setup Guide](docs/setup-guide.md) - Detailed configuration
- [Customization](docs/customization.md) - Modify for your needs
- [System Prompt](prompts/system-prompt.md) - Complete prompt reference
- [Reference Examples](prompts/reference-examples.md) - Quality case studies

🔧 **Customize:**
- Change PR executive name (default: Ilya Morozov)
- Add DDVB methodology and awards
- Customize email template branding
- Add new target publications

📊 **Integrate:**
- WordPress auto-posting
- Slack notifications
- Airtable logging
- Google Drive export

## Support

Having issues? Check:
1. n8n execution logs (click on failed node)
2. [Setup Guide](docs/setup-guide.md) troubleshooting section
3. n8n Community: https://community.n8n.io/

## File Structure

```
case-study-generator/
├── README.md                          # Full project overview
├── QUICKSTART.md                      # This file
├── workflow/
│   └── ddvb-case-study-generator.json # n8n workflow (IMPORT THIS!)
├── prompts/
│   ├── system-prompt.md               # Complete system instructions
│   ├── reference-examples.md          # Quality case study examples
│   └── editorial-standards.md         # Russian media standards
└── docs/
    ├── setup-guide.md                 # Detailed setup instructions
    └── customization.md               # How to customize workflow
```

## What's Included

✅ **Complete n8n Workflow** with 10 configured nodes
✅ **System Prompt** with Russian Media Editorial Standards
✅ **2 Reference Examples** (Сады Придонья, Websoft)
✅ **Setup Guide** with step-by-step instructions
✅ **Customization Guide** for advanced modifications
✅ **Documentation** on Russian formatting and DDVB branding

Ready to create professional Russian case studies! 🚀

---

**Questions?** Check the [full README](README.md) or [Setup Guide](docs/setup-guide.md).
