# Quick Start Guide - Telegram Bot

Get your DDVB Case Study Generator Telegram bot running in 15 minutes!

## What You'll Need

- ✅ n8n Cloud account (or self-hosted n8n)
- ✅ Telegram account
- ✅ Perplexity API key
- ✅ OpenAI API key (with GPT-4o access)

## 6 Simple Steps

### 1️⃣ Create Telegram Bot

1. Open Telegram and message **@BotFather**
2. Send command: `/newbot`
3. Follow prompts to choose bot name and username
4. Copy the **bot token** (looks like: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`)

### 2️⃣ Import Workflow

1. Log into n8n Cloud
2. Go to **Workflows** → **Import from File**
3. Upload `workflow/ddvb-case-study-generator.json`

### 3️⃣ Add API Keys

Configure these credentials in n8n:

**Telegram Bot:**
- Type: Telegram API
- Access Token: `YOUR_BOT_TOKEN` (from step 1)

**Perplexity:**
- Type: Header Auth
- Header: `Authorization`
- Value: `Bearer YOUR_PERPLEXITY_KEY`

**OpenAI:**
- Type: OpenAI API
- API Key: `YOUR_OPENAI_KEY`

### 4️⃣ Link Credentials

1. Open imported workflow
2. Click each API node:
   - **Telegram Trigger** → Select Telegram credentials
   - **Perplexity Research** → Select Perplexity credentials
   - **Generate English Case Study** → Select OpenAI credentials
   - **Translate to Russian** → Select OpenAI credentials
   - **Send to Telegram** → Select Telegram credentials

### 5️⃣ Activate Workflow

1. Click **Activate** (toggle at top right)
2. Workflow starts listening for Telegram messages

### 6️⃣ Test Your Bot

1. Open Telegram and find your bot (search for bot username)
2. Start a chat and send (in English):
   ```
   Create a DDVB case study for Sostav.ru about rebranding craft brewery "Hops & Malt".
   Sales grew 45% after launching the new identity from DDVB.
   ```
3. Wait ~30-60 seconds
4. Receive Russian case study in Telegram!

## Expected Result

You'll receive a Telegram message with:
- ✅ Complete Russian case study
- ✅ СИТУАЦИЯ-ЗАДАЧА-РЕШЕНИЕ structure
- ✅ Client and agency quotes
- ✅ Team composition section
- ✅ Validation status

## Workflow Flow

```
You send English message to Telegram bot
    ↓
Parse Input & Extract Info
    ↓
Research (Perplexity) - Get company info
    ↓
Generate English Case Study (OpenAI GPT-4o)
    ↓
Translate to Russian (OpenAI GPT-4o with special prompt)
    ↓
Validate Quality - Check Russian standards
    ↓
Send to Telegram - Deliver Russian case study to you
```

## Key Features

🤖 **Telegram Bot**
- Easy access from mobile or desktop
- No email needed
- Instant delivery

🇬🇧➡️🇷🇺 **English-First Approach**
- Input in English (easier to write)
- Generated in English first (better quality)
- Professionally translated to Russian
- Russian media standards applied

📊 **Research-Powered**
- Perplexity finds company info
- Industry context included
- Competitive landscape analyzed

✍️ **Professional Generation**
- GPT-4o creates publication-ready content
- Follows SITUATION-TASK-SOLUTION structure
- Mandatory client + agency quotes

🔄 **Translation with Standards**
- Dedicated translation step
- Russian quotation marks «кавычки»
- Em-dashes, number formatting (10 000)
- Proper брендинг terminology

✅ **Quality Validated**
- Character limits checked
- Russian formatting verified
- DDVB branding confirmed

## Troubleshooting

### Bot not responding?
- Check if workflow is **Activated** (toggle ON in n8n)
- Verify Telegram bot token is correct
- Ensure bot username is correct
- Try sending `/start` to bot first

### API errors?
- Confirm API keys are correct (no extra spaces)
- Check API quota/billing status
- Verify GPT-4o access for OpenAI
- Check Perplexity API limits

### Translation quality issues?
- Review translation prompt in workflow
- Check temperature settings (lower = more consistent)
- Verify Russian formatting requirements

### Case study missing elements?
- Ensure English prompt has clear structure
- Check SITUATION-TASK-SOLUTION is emphasized
- Verify quote generation logic

## Next Steps

📖 **Full Documentation:**
- [README](README.md) - Complete project overview
- [Setup Guide](docs/setup-guide.md) - Detailed configuration
- [Customization](docs/customization.md) - Modify for your needs
- [System Prompt](prompts/system-prompt.md) - English prompt reference
- [Translation Prompt](prompts/translation-prompt.md) - Russian translation guidelines

🔧 **Customize:**
- Change PR executive name (default: Ilya Morozov)
- Add DDVB methodology and awards
- Add new target publications
- Customize validation rules

📊 **Monitor:**
- Check n8n execution logs
- Monitor API usage and costs
- Track case study quality

## Example Usage

**You (in English):**
```
Create a Forbes Russia case study about DDVB's rebranding work for fintech startup FinTechPro.

After the rebrand, they raised $5M in Series A funding.

The project included:
- Brand strategy and positioning
- New visual identity
- Website design
- Marketing collateral

Timeline: 3 months
Team: 5 DDVB designers, 2 strategists
```

**Bot responds (in Russian):**
```
📄 **Кейс DDVB готов!**

[Complete Russian case study with proper formatting, quotes, structure]

---

✅ All quality checks passed
```

## Support

Having issues?
1. Check n8n execution logs (click on failed node)
2. Review [Setup Guide](docs/setup-guide.md) troubleshooting section
3. Verify all API credentials
4. Test with simple message first

## What's Included

✅ **Telegram Bot Integration** - No email needed
✅ **English Input** - Write requests in English
✅ **English-First Generation** - Better quality
✅ **Professional Translation** - Russian media standards
✅ **Complete Workflow** with 11 nodes
✅ **Quality Validation** - Automated checks
✅ **Documentation** - Setup and customization guides

Ready to generate professional Russian case studies via Telegram! 📱🇷🇺

---

**Questions?** Check the [full README](README.md) or [Setup Guide](docs/setup-guide.md).
