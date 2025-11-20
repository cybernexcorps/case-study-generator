# Customization Guide: DDVB Case Study Generator

Learn how to customize the workflow for your specific needs, add new features, and optimize for different use cases.

## Table of Contents

1. [Customizing System Prompt](#customizing-system-prompt)
2. [Modifying AI Behavior](#modifying-ai-behavior)
3. [Adding New Publications](#adding-new-publications)
4. [Telegram Delivery Customization](#telegram-delivery-customization)
5. [Language Detection Improvements](#language-detection-improvements)
6. [Adding Validation Rules](#adding-validation-rules)
7. [Integrating with External Systems](#integrating-with-external-systems)
8. [Advanced Features](#advanced-features)

---

## Customizing System Prompt

The system prompt is the core of case study generation. It's embedded in the **"Prepare OpenAI Request"** node.

### Updating Agency Information

Edit the "About DDVB Agency" section:

```javascript
## About DDVB Agency
DDVB is a Russian branding agency specializing in:
- Brand Strategy (стратегия бренда)
- Brand Identity & Visual Identity (айдентика и фирменный стиль)
- Rebranding (ребрендинг)
- Naming (нейминг)
- Packaging Design (дизайн упаковки)
- Brand Positioning (позиционирование)

// ADD YOUR CUSTOM SERVICES:
- Digital Strategy (цифровая стратегия)
- Motion Design (моушн-дизайн)
- Brand Architecture (архитектура бренда)
```

### Changing PR Executive Name

Replace "Ilya Morozov" throughout:

```javascript
You are [Your Name], Senior PR Executive at DDVB...
```

Search for all instances of "Ilya Morozov" in:

- System prompt
- Telegram response templates
- Documentation

### Adding DDVB Methodology

Include your proprietary frameworks:

```javascript
## DDVB Unique Methodology

DDVB uses the following proprietary frameworks:

**1. Brand DNA Analysis™**
- Deep dive into brand essence
- Competitive positioning mapping
- Consumer perception research

**2. Creative Sprint Process**
- 5-day intensive design sprints
- Rapid prototyping and testing
- Stakeholder co-creation sessions

**3. Implementation Roadmap**
- Phased rollout strategy
- Training and guidelines
- Performance tracking KPIs

Always reference these methodologies when describing DDVB's approach.
```

### Adding Company History & Awards

Build credibility with achievements:

```javascript
## About DDVB Agency

Founded in [Year], DDVB has:
- Won [X] international design awards (Red Dot, Pentawards, etc.)
- Completed [X]+ branding projects across [X] industries
- Worked with leading brands including [Client 1], [Client 2], [Client 3]
- Ranked Top [X] branding agency in Russia by [Publication]

This context positions DDVB as an industry leader.
```

---

## Modifying AI Behavior

### Adjusting Temperature

**In "OpenAI Case Study Generation" node:**

```json
"temperature": 0.8  // Default (for GPT-4, GPT-4o)

// Options for GPT-4/GPT-4o:
0.3-0.5: More consistent, predictable output
0.6-0.8: Balanced creativity and consistency (recommended)
0.9-1.2: More creative, varied output (may be less consistent)
```

⚠️ **Important for GPT-5 Models:**
- GPT-5 (o1-preview, o1-mini) **only supports** `temperature: 1` (the default)
- Using any other temperature value (e.g., 0.8, 0.7) will cause a "Bad request" error
- GPT-5 models do not allow temperature customization

**Recommendation:** 
- For GPT-4/GPT-4o: Start with 0.8, adjust based on output quality
- For GPT-5: Must use `temperature: 1` (fixed value)

### Changing Max Tokens

```json
"max_tokens": 4000  // Default (for GPT-4, GPT-4o)

// Adjust based on needs:
2000-3000: Shorter case studies
3000-4000: Standard length (recommended)
4000-6000: Longer, detailed case studies
```

⚠️ **Important for GPT-5 Models:**
- GPT-5 (o1-preview, o1-mini) uses `max_completion_tokens` instead of `max_tokens`
- Using `max_tokens` with GPT-5 will cause a "Bad request" error
- Example: `"max_completion_tokens": 8000` (recommended for GPT-5)

⚠️ **Note:** Higher token counts = higher API costs

### Using Different OpenAI Models

```json
"model": "gpt-4o"  // Default

// Alternatives:
"gpt-4-turbo": Faster, slightly lower quality
"gpt-4": High quality, slower
"gpt-4o": Best for this task (balanced speed + quality)
```

### Adjusting Research Depth (Perplexity)

**In "Perplexity Research" node:**

```json
"temperature": 0.3  // Factual research

// Increase for more creative research:
0.3-0.4: Factual, conservative
0.5-0.6: Balanced
0.7+: More interpretive (less recommended for research)
```

```json
"max_tokens": 1000  // Research length

// Adjust:
500-800: Quick background research
1000-1500: Standard depth (recommended)
1500-2000: Deep dive research
```

---

## Adding New Publications

To add support for new publications (e.g., The Brand, Design Russia):

### Step 1: Define Publication Profile

Create a new publication profile in the system prompt:

```javascript
**The Brand Magazine** - 1200-1800 words:
- Deep analytical tone
- Focus on brand strategy and positioning
- Include market analysis and competitive context
- Technical branding terminology encouraged
- Longer quotes (800-1000 characters)
- Academic references welcome

**Design Russia** - 800-1000 words:
- Visual storytelling emphasis
- Technical design process details
- Typography, color theory, design system focus
- Designer quotes prioritized
- Include design rationale
- Portfolio-style presentation
```

### Step 2: Add Publication Detection

Edit **"Language Detection & Parsing"** node:

```javascript
const messageData = {
  // ... existing code ...

  // Detect target publication
  targetPublication: detectPublication(userMessage),

  // ... rest of code ...
};

function detectPublication(message) {
  const msg = message.toLowerCase();

  if (msg.includes('sostav') || msg.includes('состав')) return 'sostav';
  if (msg.includes('forbes')) return 'forbes_russia';
  if (msg.includes('rbc') || msg.includes('рбк')) return 'rbc';
  if (msg.includes('vc.ru') || msg.includes('вс.ру')) return 'vcru';
  if (msg.includes('the brand')) return 'the_brand';
  if (msg.includes('design russia')) return 'design_russia';

  return 'default'; // Sostav.ru style by default
}
```

### Step 3: Pass to OpenAI Prompt

Modify system prompt to use publication info:

```javascript
Current target publication: ${userData.targetPublication || 'sostav'}

Adapt your case study to this publication's style and requirements as defined in the publication profiles above.
```

---

## Telegram Delivery Customization

The workflow now delivers every case study directly in Telegram via the **"Send to Telegram"** node. Use this section to adapt the messaging, layout, and interactive elements to your needs.

### Message Template Basics

- Telegram accepts **MarkdownV2** or **HTML** formatting. Set `parseMode` inside the node’s *Additional Fields*.
- Keep each message under Telegram’s 4096-character limit. Split long responses into multiple messages if needed.
- Build the body dynamically so metadata, validation, and quotes stay in sync with upstream nodes.

```javascript
{{ [
  '*DDVB Case Study Ready*',
  `*Название:* ${$json.title}`,
  `*Целевая площадка:* ${$json.targetPublication}`,
  '',
  $json.content,
  '',
  `*Валидация:* ${$json.validationSummary}`
].join('\n') }}
```

### Splitting Long Messages

Use a Function node before the Telegram node to chunk long texts:

```javascript
const chunkSize = 3500;
const text = $json.content;
const chunks = [];

for (let i = 0; i < text.length; i += chunkSize) {
  chunks.push(text.slice(i, i + chunkSize));
}

return chunks.map(chunk => ({ json: { chunk } }));
```

Then send each chunk with an Item Lists→Split in Batches node followed by Telegram → Send Message (set `text` to `={{ $json.chunk }}`).

### Adding Metadata + Inline Buttons

Leverage Telegram keyboards for quick actions (e.g., open Google Doc, mark as approved):

```json
"additionalFields": {
  "parseMode": "MarkdownV2",
  "replyMarkup": {
    "rows": [
      [
        {
          "text": "📄 Исходник",
          "url": "={{ $json.caseStudyLink }}"
        }
      ],
      [
        {
          "text": "🔁 Запросить правки",
          "callbackData": "request_revision"
        }
      ]
    ]
  }
}
```

### Sending Attachments

- Use **Telegram → Send Document** to attach the final case study as a TXT/PDF exported from the validation node.
- Combine with the message node by chaining them in sequence or wrapping them in an IF node (send document only when QA passes).

### Status + Alert Messages

Add short status updates to keep users informed:

- “Исследуем данные…”
- “Генерируем черновик…”
- “Проверяем редакционные стандарты…”

These can be optional Telegram nodes triggered via IF nodes tied to specific execution stages.

---

## Language Detection Improvements

Enhance the **"Language Detection & Parsing"** node.

### Multi-Language Support

```javascript
function detectLanguage(text) {
  // Cyrillic (Russian, Ukrainian, etc.)
  if (/[А-Яа-яЁёЇїІіЄєҐґ]/.test(text)) return 'russian';

  // Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) return 'chinese';

  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) return 'arabic';

  // Japanese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'japanese';

  // Korean
  if (/[\uAC00-\uD7AF]/.test(text)) return 'korean';

  // Default to English
  return 'english';
}

const communicationLanguage = detectLanguage(userMessage);
```

### Entity Extraction

Extract key information from user message:

```javascript
function extractEntities(message) {
  // Client name (quoted text or proper nouns)
  const clientMatch = message.match(/["«]([^"»]+)["»]|(?:client|клиент)[:\s]+([A-ZА-Я][a-zа-я\s]+)/i);
  const client = clientMatch ? (clientMatch[1] || clientMatch[2]) : null;

  // Metrics (percentages, dollar amounts)
  const metrics = message.match(/\d+%|\$\d+[MKмлн]*|₽\d+[млн]*/gi) || [];

  // Project type
  const projectTypes = {
    branding: /брендинг|branding|brand strategy/i,
    rebranding: /ребрендинг|rebrand|redesign|редизайн/i,
    packaging: /упаковк|packaging|package design/i,
    identity: /айдентик|identity|visual identity/i,
    naming: /нейминг|naming/i
  };

  const projectType = Object.keys(projectTypes).find(type =>
    projectTypes[type].test(message)
  );

  return { client, metrics, projectType };
}

const entities = extractEntities(userMessage);
```

### Sentiment Analysis

Determine user intent:

```javascript
function analyzeIntent(message) {
  const msg = message.toLowerCase();

  // Urgency indicators
  const isUrgent = /срочно|urgent|asap|быстро|quickly/.test(msg);

  // Request type
  const isQuestion = /как|how|можно ли|can you|what|что/.test(msg);
  const isDirectRequest = /создай|create|сделай|make|напиши|write/.test(msg);

  // Formality level
  const isFormal = /пожалуйста|please|благодарю|спасибо/.test(msg);

  return { isUrgent, isQuestion, isDirectRequest, isFormal };
}

const intent = analyzeIntent(userMessage);
```

---

## Adding Validation Rules

Enhance the **"Validate Case Study"** node with custom rules.

### Character Limit Validation

```javascript
// Extract sections from response
function extractSections(text) {
  const titleMatch = text.match(/^[^\n]+/);
  const title = titleMatch ? titleMatch[0] : '';

  const quoteMatches = text.match(/^>.*$/gm) || [];
  const quotes = quoteMatches.map(q => q.replace(/^>\s*\*?\*?/, '').trim());

  return { title, quotes, fullText: text };
}

const sections = extractSections(response);

// Validate character limits
const validations = {
  titleLength: sections.title.length <= 90,
  titleValid: sections.title.length > 0 && !sections.title.match(/^[0-9]/) && !sections.title.match(/^(в|на|для|о|под)\s/i),

  hasMinQuotes: sections.quotes.length >= 2,
  quote1Length: sections.quotes[0] ? (sections.quotes[0].length >= 500 && sections.quotes[0].length <= 700) : false,
  quote2Length: sections.quotes[1] ? (sections.quotes[1].length >= 500 && sections.quotes[1].length <= 700) : false,

  textLength: sections.fullText.length >= 1500 && sections.fullText.length <= 3000,

  hasRussianText: /[А-Яа-яЁё]/.test(sections.fullText),
  hasProperQuotes: /«.*»/.test(sections.fullText),
  hasDDVBBranding: /DDVB|агентство|команда/.test(sections.fullText),
  hasStructure: /СИТУАЦИЯ|ЗАДАЧА|РЕШЕНИЕ|ситуация|задача|решение/.test(sections.fullText) ||
                (sections.fullText.split('\n\n').length >= 3)
};
```

### Quality Score

```javascript
// Calculate quality score
function calculateQualityScore(validations) {
  const weights = {
    titleLength: 10,
    titleValid: 10,
    hasMinQuotes: 15,
    quote1Length: 10,
    quote2Length: 10,
    textLength: 15,
    hasRussianText: 10,
    hasProperQuotes: 5,
    hasDDVBBranding: 10,
    hasStructure: 5
  };

  let score = 0;
  let maxScore = 0;

  for (const [key, weight] of Object.entries(weights)) {
    maxScore += weight;
    if (validations[key]) score += weight;
  }

  return Math.round((score / maxScore) * 100);
}

const qualityScore = calculateQualityScore(validations);
```

### Auto-Correction Trigger

```javascript
// If quality is low, trigger revision
if (qualityScore < 70) {
  // Add revision node that sends corrected prompt to OpenAI
  return {
    json: {
      ...caseStudy,
      needsRevision: true,
      revisionReason: Object.entries(validations)
        .filter(([key, value]) => !value)
        .map(([key]) => key)
        .join(', '),
      qualityScore
    }
  };
}
```

---

## Integrating with External Systems

### WordPress Integration

Add a new node after validation to post to WordPress:

```javascript
// HTTP Request node configuration
{
  "method": "POST",
  "url": "https://your-site.com/wp-json/wp/v2/posts",
  "authentication": "basicAuth", // or use OAuth2
  "sendBody": true,
  "bodyParameters": {
    "title": "={{ $json.title }}",
    "content": "={{ $json.content }}",
    "status": "draft",
    "categories": [123], // DDVB case studies category ID
    "tags": "={{ $json.keywords.split(',').map(k => k.trim()) }}",
    "meta": {
      "publication": "={{ $json.targetPublication }}",
      "client": "={{ $json.clientName }}"
    }
  }
}
```

### Slack Notification

Notify team when case study is generated:

```javascript
// Slack node configuration
{
  "channel": "#case-studies",
  "text": "🎉 New DDVB case study generated!",
  "attachments": [
    {
      "color": "#36a64f",
      "fields": [
        {
          "title": "Title",
          "value": "={{ $json.title }}",
          "short": false
        },
        {
          "title": "Target Publication",
          "value": "={{ $json.targetPublication }}",
          "short": true
        },
        {
          "title": "Quality Score",
          "value": "={{ $json.qualityScore }}%",
          "short": true
        }
      ],
      "actions": [
        {
          "type": "button",
          "text": "View Full Case Study",
          "url": "={{ $json.caseStudyLink || $json.telegramMessageUrl || $json.executionUrl }}"
        }
      ]
    }
  ]
}
```

### Airtable Logging

Log all generated case studies to Airtable for tracking:

```javascript
// Airtable node configuration
{
  "operation": "create",
  "table": "Case Studies",
  "fields": {
    "Title": "={{ $json.title }}",
    "Client": "={{ $json.clientName }}",
    "Publication": "={{ $json.targetPublication }}",
    "Generated Date": "={{ $json.generatedAt }}",
    "Quality Score": "={{ $json.qualityScore }}",
    "Word Count": "={{ $json.wordCount }}",
    "Requester Username": "={{ $json.telegram?.username || $json.chatUsername || '' }}",
    "Content": "={{ $json.content }}"
  }
}
```

### Google Drive Export

Save case study to Google Drive:

```javascript
// Google Drive node configuration
{
  "operation": "upload",
  "folderId": "YOUR_FOLDER_ID",
  "fileName": "={{ $json.title }}_{{ $now.format('YYYY-MM-DD') }}.txt",
  "fileContent": "={{ $json.content }}",
  "mimeType": "text/plain"
}
```

---

## Advanced Features

### Multi-Turn Conversation

Enable back-and-forth clarification:

1. Add **"Sticky Note"** to track conversation state
2. Store context in workflow static data
3. Implement conversation memory:

```javascript
// In "Language Detection & Parsing" node
const conversationHistory = $workflow.staticData.conversations || {};
const sessionHistory = conversationHistory[sessionId] || [];

sessionHistory.push({
  role: 'user',
  content: userMessage,
  timestamp: new Date().toISOString()
});

// Store back
$workflow.staticData.conversations = conversationHistory;
conversationHistory[sessionId] = sessionHistory;
```

### Auto-Translation Option

Add translation for international publications:

```javascript
// DeepL or Google Translate node
{
  "method": "POST",
  "url": "https://api.deepl.com/v2/translate",
  "authentication": "headerAuth",
  "bodyParameters": {
    "text": "={{ $json.content }}",
    "source_lang": "RU",
    "target_lang": "EN",
    "preserve_formatting": true,
    "formality": "more" // Formal tone
  }
}
```

### A/B Testing Different Prompts

Test prompt variations:

```javascript
// In "Prepare OpenAI Request" node
const promptVariants = [
  systemPromptA, // More creative
  systemPromptB, // More structured
  systemPromptC  // More concise
];

// Random selection (or based on publication type)
const selectedPrompt = promptVariants[Math.floor(Math.random() * promptVariants.length)];

// Or round-robin
const variantIndex = ($execution.id % promptVariants.length);
const selectedPrompt = promptVariants[variantIndex];
```

### Feedback Loop

Collect user feedback to improve:

1. Add inline button or slash-command in Telegram (e.g., “Оценить материал”)
2. Create webhook endpoint for feedback
3. Log to database
4. Analyze feedback trends
5. Update prompts accordingly

```javascript
// Feedback collection node
{
  "webhookTrigger": "/feedback/:caseStudyId",
  "method": "POST",
  "responseMode": "onReceived",
  "options": {
    "responseData": "firstEntryJson"
  }
}

// Process feedback
const feedback = {
  caseStudyId: $json.caseStudyId,
  rating: $json.rating, // 1-5 stars
  comments: $json.comments,
  categories: $json.categories, // ["language", "structure", "accuracy"]
  timestamp: new Date().toISOString()
};

// Store in database or Airtable
```

### Version Control

Track prompt versions:

```javascript
const systemPromptVersion = "2.1.0";
const lastUpdated = "2024-11-19";

// Include in output
return {
  json: {
    ...caseStudy,
    meta: {
      promptVersion: systemPromptVersion,
      modelUsed: "gpt-4o",
      generatedAt: new Date().toISOString()
    }
  }
};
```

---

## Testing Custom Changes

### Test Checklist

After any customization:

- [ ] Test with Russian input
- [ ] Test with English input
- [ ] Verify all validations pass
- [ ] Check Telegram delivery
- [ ] Confirm Russian formatting (кавычки, em-dashes)
- [ ] Validate character limits
- [ ] Ensure DDVB branding present
- [ ] Test error scenarios
- [ ] Check API costs (tokens used)
- [ ] Review output quality

### Test Scenarios

Create test cases covering:

1. **Minimal input:** "Создай кейс для Sostav"
2. **Detailed input:** Full project description with metrics
3. **English input:** Same as #2 but in English
4. **Mixed language:** English + Russian terms
5. **Different publications:** Forbes, RBC, VC.ru
6. **Edge cases:** Very long/short messages
7. **Error handling:** Invalid API keys, network issues

### Performance Monitoring

Track key metrics:

- **Execution time:** Target < 30 seconds
- **Token usage:** Monitor costs per execution
- **Success rate:** Target > 95%
- **Quality score:** Target > 80/100
- **User satisfaction:** Collect feedback

---

## Best Practices

### 1. Iterative Improvement

- Start with baseline configuration
- Make one change at a time
- Test thoroughly before next change
- Document all customizations
- Keep backup of working versions

### 2. Prompt Engineering

- Be specific and explicit in instructions
- Use examples to demonstrate desired output
- Structure prompts clearly (sections, bullets)
- Test with edge cases
- Iterate based on real output

### 3. Error Handling

- Add try-catch logic in code nodes
- Implement retry mechanisms for API calls
- Validate inputs before processing
- Provide helpful error messages to users
- Log errors for debugging

### 4. Cost Optimization

- Use appropriate model for each task (not always GPT-4)
- Limit max_tokens to necessary amount
- Cache API responses when possible
- Implement rate limiting
- Monitor token usage trends

### 5. User Experience

- Respond quickly to user input
- Provide status updates during processing
- Make error messages user-friendly
- Offer clear next steps
- Support conversation flow naturally

---

## Example Customizations

### Custom Publication: "The Brand"

```javascript
// Add to system prompt
**The Brand Magazine** - 1200-1800 words:
- Deep analytical tone with strategic focus
- Emphasis on brand positioning and competitive analysis
- Include market research insights
- Technical branding terminology encouraged
- Longer, more substantive quotes (800-1000 chars)
- Academic references and theory welcome
- Structure: Context → Analysis → Strategy → Execution → Impact

// Update detection
if (msg.includes('the brand') || msg.includes('зе бренд')) {
  targetPublication = 'the_brand';
  targetLength = '1500-1800'; // characters
  targetTone = 'analytical';
}
```

### Industry-Specific Templates

```javascript
// Detect industry
const industries = {
  fmcg: /fmcg|продукт|еда|food|beverage|напиток/i,
  tech: /tech|технолог|software|софт|digital|цифров/i,
  retail: /retail|ритейл|магазин|store|торговл/i,
  b2b: /b2b|business|бизнес|enterprise|корпоратив/i
};

const industry = Object.keys(industries).find(ind => industries[ind].test(userMessage));

// Add industry-specific context to prompt
if (industry === 'fmcg') {
  additionalContext = `
    This is an FMCG project. Emphasize:
    - Packaging design and shelf impact
    - Consumer behavior insights
    - Retail performance metrics
    - Purchase triggers and brand loyalty
  `;
}
```

---

## Troubleshooting Custom Changes

### Changes Not Applied

1. Save workflow after editing
2. Re-activate workflow (toggle off/on)
3. Clear browser cache
4. Test in incognito/private mode
5. Check execution logs for errors

### Validation Failing

1. Review validation logic carefully
2. Test edge cases
3. Add console logs to debug
4. Simplify validation rules
5. Check data types and formats

### Output Quality Degraded

1. Compare with previous prompt version
2. Test temperature settings
3. Review example quality
4. Check if instructions conflicting
5. Simplify complex requirements

---

## Next Steps

1. **Experiment:** Try small customizations first
2. **Document:** Keep notes on what works
3. **Test:** Validate with real use cases
4. **Iterate:** Continuously improve based on feedback
5. **Share:** Document successful patterns for team

Happy customizing! 🚀
