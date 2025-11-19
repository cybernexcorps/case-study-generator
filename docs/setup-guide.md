# Setup Guide: DDVB Case Study Generator for n8n Cloud

Complete step-by-step guide for deploying the DDVB Case Study Generator workflow in n8n Cloud.

## Prerequisites

Before starting, ensure you have:

1. **n8n Cloud Account**
   - Sign up at https://n8n.io/cloud if you don't have an account
   - Ensure you have an active subscription (required for chat interface)

2. **API Keys**
   - **Perplexity API Key**: Get from https://www.perplexity.ai/settings/api
   - **OpenAI API Key**: Get from https://platform.openai.com/api-keys
     - ⚠️ Ensure you have access to GPT-4o model
   - **SMTP Credentials**: For sending emails
     - Gmail, Outlook, or custom SMTP server

3. **Email Address**
   - The workflow sends case studies via email
   - Have your recipient email address ready

---

## Step 1: Import the Workflow

### 1.1 Download the Workflow File

Download or copy the workflow JSON file:
```
workflow/ddvb-case-study-generator.json
```

### 1.2 Import into n8n Cloud

1. Log into your n8n Cloud account
2. Go to **Workflows** in the left sidebar
3. Click **Import from File** button (top right)
4. Select `ddvb-case-study-generator.json`
5. Click **Import**

The workflow will appear in your workflows list.

---

## Step 2: Configure API Credentials

### 2.1 Add Perplexity API Credentials

1. Open the imported workflow
2. Go to **Credentials** menu (left sidebar)
3. Click **Create New Credential**
4. Search for "HTTP Request" or create a custom credential
5. Configure as follows:

**For Perplexity (using HTTP Request with Header Auth):**

```
Name: Perplexity API
Credential Type: Header Auth
Header Name: Authorization
Header Value: Bearer YOUR_PERPLEXITY_API_KEY
```

Replace `YOUR_PERPLEXITY_API_KEY` with your actual key.

**Alternative: Create Generic Credential**

If "perplexityApi" credential type doesn't exist:

1. Use **HTTP Header Auth** credential type
2. Name: `Perplexity API`
3. Name: `Authorization`
4. Value: `Bearer YOUR_PERPLEXITY_API_KEY`

### 2.2 Add OpenAI API Credentials

1. In **Credentials** menu, click **Create New Credential**
2. Search for "OpenAI"
3. Select **OpenAI API**
4. Configure:

```
Name: OpenAI API
API Key: YOUR_OPENAI_API_KEY
```

**Important:** Verify you have GPT-4o model access:
- Go to https://platform.openai.com/account/limits
- Check if `gpt-4o` is listed under available models
- If not, you may need to upgrade your OpenAI account or use `gpt-4-turbo` instead

### 2.3 Add SMTP Email Credentials

1. In **Credentials** menu, click **Create New Credential**
2. Search for "SMTP"
3. Select **SMTP**
4. Configure based on your email provider:

**For Gmail:**

```
Name: Gmail SMTP
Host: smtp.gmail.com
Port: 587
SSL/TLS: True
User: your-email@gmail.com
Password: your-app-password (not regular password!)
```

⚠️ **Gmail requires App Password:**
- Go to https://myaccount.google.com/apppasswords
- Generate an app-specific password
- Use that password, not your regular Gmail password

**For Outlook/Office 365:**

```
Name: Outlook SMTP
Host: smtp.office365.com
Port: 587
SSL/TLS: True
User: your-email@outlook.com
Password: your-password
```

**For Custom SMTP:**

```
Name: Custom SMTP
Host: your-smtp-host.com
Port: 587 or 465
SSL/TLS: True (recommended)
User: your-smtp-username
Password: your-smtp-password
```

---

## Step 3: Link Credentials to Nodes

### 3.1 Update Perplexity Research Node

1. Open the workflow
2. Click on the **"Perplexity Research"** node
3. In the node settings:
   - Under **Authentication**, select your Perplexity credential
   - If using Header Auth, ensure it's properly configured
4. Click **Execute Node** to test (should return research results)

### 3.2 Update OpenAI Generation Node

1. Click on the **"OpenAI Case Study Generation"** node
2. In the node settings:
   - Under **Authentication**, select your OpenAI API credential
3. Verify model is set to `gpt-4o`
   - If you don't have GPT-4o access, use `gpt-4-turbo` or `gpt-4`
4. Click **Execute Node** to test (requires input from previous nodes)

### 3.3 Update Send Email Node

1. Click on the **"Send Email"** node
2. In the node settings:
   - Under **Credentials**, select your SMTP credential
   - Update **From Email**: Change `noreply@ddvb.agency` to your sending email
   - Update **To Email**: This is dynamic (uses `{{ $json.userEmail }}`)
     - For testing, you can hardcode your email address temporarily

---

## Step 4: Configure the Chat Interface

### 4.1 Enable Chat Trigger

1. Click on the **"Chat Trigger"** node
2. In the node settings:
   - Set **Webhook ID**: `ddvb-case-study-chat` (or customize)
   - Configure **Options** if needed:
     - Session Duration
     - Initial Messages
     - Public Access (enable for testing)

### 4.2 Get Chat URL

1. Click **Save** on the workflow
2. Click **Activate** (toggle switch at top right)
3. The Chat Trigger node will show a URL like:
   ```
   https://your-instance.app.n8n.cloud/webhook/chat/ddvb-case-study-chat
   ```
4. Copy this URL - this is your chat interface endpoint

### 4.3 Test Chat Interface

1. Open the chat URL in a new browser tab
2. You should see a chat interface
3. Type a test message:
   ```
   Создай кейс DDVB для Sostav.ru о ребрендинге пивоварни "Хмель & Солод"
   ```
4. The workflow should execute and respond

---

## Step 5: Configure Email Collection

The workflow needs to collect the user's email address to send the case study.

### 5.1 Add Email Collection to Chat Flow

You have two options:

**Option A: Ask for email in conversation (Recommended)**

Modify the **"Prepare OpenAI Request"** code node to include email collection in the prompt:

```javascript
// Add to system prompt
If this is the first message, first ask: "Please provide your email address where I should send the completed case study."

Store email in session context for later use.
```

**Option B: Hardcode email for testing**

In the **"Validate Case Study"** node, replace:

```javascript
userEmail: originalData.userEmail || 'user@example.com'
```

With your actual email:

```javascript
userEmail: 'your-email@example.com'
```

**Option C: Use URL parameter**

Modify chat URL to accept email parameter:
```
https://your-instance.app.n8n.cloud/webhook/chat/ddvb-case-study-chat?email=user@example.com
```

And extract it in the "Language Detection & Parsing" node.

---

## Step 6: Test the Complete Workflow

### 6.1 Manual Execution Test

1. Click on the **"Chat Trigger"** node
2. Click **"Listen for Test Event"**
3. In a separate tab, open the chat interface
4. Send a test message
5. Watch the workflow execute in n8n
6. Check each node for errors
7. Verify email is received

### 6.2 Test with Russian Input

```
Создай кейс DDVB для Sostav.ru о ребрендинге крафтовой пивоварни "Хмель & Солод".
Продажи выросли на 45% после запуска новой айдентики от DDVB.
```

**Expected:**
- Clarifying questions in Russian
- Complete case study in Russian
- Email sent with Russian content

### 6.3 Test with English Input

```
Create a DDVB case study for Forbes Russia about rebranding fintech startup "FinTechPro".
After DDVB's rebrand, they attracted $5M investment.
```

**Expected:**
- Clarifying questions in English
- Complete case study in Russian (despite English input)
- Email sent with Russian content

---

## Step 7: Customize the Workflow (Optional)

### 7.1 Adjust AI Model Settings

**OpenAI Node:**
- `model`: Change to `gpt-4-turbo` or `gpt-4` if needed
- `temperature`: 0.8 (higher = more creative, lower = more consistent)
- `max_tokens`: 4000 (adjust based on needs)

**Perplexity Node:**
- `model`: `llama-3.1-sonar-large-128k-online` (or latest)
- `temperature`: 0.3 (factual research)
- `max_tokens`: 1000

### 7.2 Modify System Prompt

To customize DDVB branding, team members, or methodology:

1. Edit the **"Prepare OpenAI Request"** node
2. Modify the `systemPrompt` variable
3. Update sections:
   - "About DDVB Agency" - Add specific services or methodology names
   - Team member names - Replace "Ilya Morozov" with actual names
   - Examples - Add company-specific case study patterns

### 7.3 Change Email Template

Edit the **"Send Email"** node HTML template:

1. Click on the node
2. Modify the `message` parameter
3. Customize:
   - Header branding
   - Color scheme
   - Footer information
   - Logo (add <img> tag with hosted logo URL)

### 7.4 Add Language Detection Improvements

Edit **"Language Detection & Parsing"** node to:
- Improve Cyrillic detection
- Extract more entities (dates, numbers, brands)
- Better determine when research is needed

---

## Step 8: Production Deployment

### 8.1 Disable Test Mode

1. Remove any hardcoded test emails
2. Ensure dynamic email collection is working
3. Test with multiple users

### 8.2 Set Up Monitoring

1. Go to **Executions** in n8n
2. Monitor for:
   - Failed executions
   - API errors
   - Email delivery issues

### 8.3 Configure Error Handling

Add error handling nodes:

1. After each API call node, add **"IF"** node
2. Check for error conditions
3. Route to error handler or retry logic
4. Send notification to admin if critical error

### 8.4 Set Up Webhook Security (Recommended)

1. In Chat Trigger node settings
2. Enable authentication:
   - Basic Auth
   - Header Auth
   - API Key
3. Share authenticated URL with users

### 8.5 Configure Rate Limiting

To prevent abuse:

1. Add **"Sticky Note"** with usage limits
2. Implement counter in **"Language Detection & Parsing"**
3. Track requests per session/user
4. Add throttling logic if needed

---

## Troubleshooting

### Common Issues

#### 1. Workflow Not Executing

**Symptoms:** Chat doesn't respond or workflow doesn't start

**Solutions:**
- Ensure workflow is **Activated** (toggle at top right)
- Check Chat Trigger node has valid webhook ID
- Verify URL is correct
- Check browser console for errors
- Try disabling browser extensions

#### 2. Perplexity API Errors

**Symptoms:** "Perplexity Research" node fails

**Solutions:**
- Verify API key is correct (check for extra spaces)
- Check API quota: https://www.perplexity.ai/settings/api
- Ensure request format is valid (JSON)
- Try reducing `max_tokens` if timeout occurs

#### 3. OpenAI API Errors

**Symptoms:** "OpenAI Case Study Generation" node fails

**Solutions:**
- Check API key: https://platform.openai.com/api-keys
- Verify GPT-4o access: https://platform.openai.com/account/limits
- If no GPT-4o access, change model to `gpt-4-turbo` or `gpt-4`
- Check API quota and billing
- Reduce `max_tokens` if response is cut off

#### 4. Email Not Sending

**Symptoms:** "Send Email" node fails or email not received

**Solutions:**
- **Gmail:** Use App Password, not regular password
  - Go to https://myaccount.google.com/apppasswords
  - Enable 2FA first, then generate app password
- **Outlook:** Ensure SMTP is enabled in account settings
- Check spam/junk folder
- Verify SMTP host and port are correct
- Test with a simple email client (Thunderbird, Outlook) first
- Check firewall/security settings

#### 5. Case Study Not in Russian

**Symptoms:** Output is in English or mixed language

**Solutions:**
- Verify system prompt includes "CRITICAL: ALL case study outputs must be written in RUSSIAN"
- Check OpenAI model language capabilities
- Increase temperature slightly (0.8-0.9) for better Russian output
- Ensure Russian reference examples are in the prompt

#### 6. Missing Quotes

**Symptoms:** Case study generated without client/agency quotes

**Solutions:**
- Verify prompt includes "MANDATORY: Client AND agency quotes"
- Check quote generation logic in system prompt
- Ensure OpenAI temperature is not too low (min 0.7)
- Add explicit quote examples to the prompt

#### 7. Character Limit Violations

**Symptoms:** Case study too long (>3,000 chars) or title too long (>90 chars)

**Solutions:**
- Update system prompt with explicit length requirements
- Add validation logic in "Validate Case Study" node
- Implement retry with length correction prompt
- Use stricter token limits in OpenAI request

---

## Advanced Configuration

### A. Multi-Language Support

To add support for more languages:

1. Edit **"Language Detection & Parsing"** node
2. Add detection for additional languages:
   ```javascript
   const hasArabic = /[\u0600-\u06FF]/.test(userMessage);
   const hasChinese = /[\u4E00-\u9FFF]/.test(userMessage);
   ```
3. Update system prompt with language options

### B. Custom Publication Formats

To add templates for specific publications:

1. Create publication-specific prompts in `/prompts/`
2. Add publication detection in "Language Detection & Parsing"
3. Pass publication type to OpenAI prompt
4. Adjust structure based on publication requirements

### C. Integration with CMS

To send case studies to WordPress, Webflow, or other CMS:

1. Add HTTP Request node after validation
2. Configure CMS API endpoint
3. Map case study fields to CMS structure
4. Include featured image upload if needed

### D. Analytics Tracking

To track usage and quality:

1. Add **"Airtable"** or **"Google Sheets"** node
2. Log execution data:
   - Timestamp
   - User language
   - Publication target
   - Case study length
   - Validation results
   - Email sent status
3. Create dashboard for insights

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check execution logs for errors
- Monitor API usage and costs
- Review email delivery rates

**Monthly:**
- Update system prompt with new examples
- Refresh API keys if expiring
- Review and improve validation logic
- Update editorial standards as needed

**Quarterly:**
- Audit case study quality
- Gather user feedback
- Update reference examples
- Optimize prompt for better results

### Updating the Workflow

To update the workflow:

1. Make changes in n8n editor
2. Test thoroughly with multiple scenarios
3. Export updated JSON: **Workflows → ... Menu → Download**
4. Save to `/workflow/` directory
5. Commit to version control with clear message

### API Key Rotation

To rotate API keys:

1. Generate new key in respective platform
2. Update credential in n8n: **Credentials → [Credential Name] → Edit**
3. Save and test workflow
4. Revoke old key in platform

---

## Security Best Practices

### 1. Credential Management

- **Never** commit API keys to version control
- Use n8n's credential system (keys are encrypted)
- Rotate keys regularly (every 3-6 months)
- Use separate keys for dev/staging/production

### 2. Webhook Security

- Enable authentication on Chat Trigger
- Use HTTPS only (n8n Cloud provides this)
- Implement rate limiting
- Monitor for unusual traffic patterns

### 3. Data Privacy

- Don't log sensitive user data
- Comply with GDPR/data protection laws
- Clear chat history after completion
- Secure email content (use TLS)

### 4. Access Control

- Limit who can edit workflow in n8n
- Use n8n's team/permission features
- Keep audit logs of changes
- Backup workflow configurations regularly

---

## Support & Resources

### Documentation

- **n8n Docs**: https://docs.n8n.io/
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Perplexity API Docs**: https://docs.perplexity.ai/

### Community

- **n8n Community Forum**: https://community.n8n.io/
- **n8n Discord**: https://discord.gg/n8n

### Getting Help

If you encounter issues:

1. Check execution logs in n8n
2. Review error messages carefully
3. Search n8n community forum
4. Check API service status pages
5. Contact API provider support if needed

---

## Next Steps

After successful setup:

1. ✅ Test with various case study scenarios
2. ✅ Gather feedback from DDVB team
3. ✅ Refine prompts based on output quality
4. ✅ Add custom DDVB examples to knowledge base
5. ✅ Share chat URL with PR team
6. ✅ Monitor usage and iterate

**Congratulations! Your DDVB Case Study Generator is ready to create publication-quality Russian case studies! 🎉**
