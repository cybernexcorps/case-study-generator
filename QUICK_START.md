# Quick Start - Prompt Externalization

## 🚀 3-Step Migration

### 1. Push to GitHub
```bash
cd "D:\Downloads\SynologyDrive\DDVB Analytics\marketing-automation-n8n\case-study-generator"
git add .
git commit -m "feat: externalize prompts"
git push origin main
```

### 2. Run Migration
```bash
cd scripts
node migrate-prompts.js
# Enter: https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts
```

### 3. Test & Import
```bash
node test-migration.js  # Should show all ✓
# Then import workflow/ddvb-case-study-generator.json into n8n
```

---

## 📋 Common Commands

### Migration
```bash
# Preview changes
npm run migrate:dry-run

# Run migration
npm run migrate

# Rollback
npm run rollback
```

### Testing
```bash
# Validate migration
npm test

# Show help
npm run help:migrate
```

---

## 📝 Update Prompts (After Migration)

### Quick Update
1. Go to GitHub → `prompts/` folder
2. Click prompt file → Edit (pencil icon)
3. Make changes → Commit
4. Done! Next execution uses new prompt

### Local Update
```bash
cd prompts
nano openai-generation.md
git add .
git commit -m "Update: improve prompts"
git push
```

---

## 🆘 Troubleshooting

### Migration Failed?
```bash
node rollback-migration.js
```

### Tests Failing?
```bash
# Check GitHub URL is correct
# Ensure prompts accessible in browser
# Re-run migration
```

### Can't Find Prompts?
Verify URL format:
```
https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/perplexity-research.md
```

---

## 📚 Documentation

| Guide | Location | Purpose |
|-------|----------|---------|
| **This Quick Start** | `QUICK_START.md` | Fast reference |
| **Complete Guide** | `docs/prompt-externalization-guide.md` | Full details |
| **Script Docs** | `scripts/README.md` | Script usage |
| **Prompt Guide** | `prompts/README.md` | Prompt management |

---

## ✅ Success Checklist

- [ ] Prompts pushed to GitHub
- [ ] GitHub URLs accessible
- [ ] Migration script completed
- [ ] All tests passed
- [ ] Workflow imported to n8n
- [ ] Test message sent
- [ ] Logs show "Prompts loaded successfully"
- [ ] Case study quality verified

---

## 🎯 What Changed

**Before:** 23KB embedded prompts → Update takes 30 min
**After:** 4 external .md files → Update takes 3 min

**Key Benefit:** Edit prompts on GitHub → Instant updates!

---

## 💡 Quick Tips

1. **Always test in dry-run first**
   ```bash
   node migrate-prompts.js --dry-run
   ```

2. **Use A/B testing with branches**
   - Create `experimental` branch
   - Update `PROMPT_VERSION` in workflow
   - Compare results

3. **Enable caching for performance**
   - See `docs/prompt-externalization-guide.md`
   - Reduces GitHub API calls by 95%

4. **Backups are automatic**
   - Git history = version control
   - Migration creates backups
   - Rollback is instant

---

## 🚨 Important URLs

Replace `YOUR-USERNAME` with your GitHub username:

```
https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/perplexity-research.md
https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/openai-generation.md
https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/russian-translation.md
https://raw.githubusercontent.com/YOUR-USERNAME/case-study-generator/main/prompts/russian-humanization.md
```

---

**Ready? Run the 3 steps above!** 🚀

For detailed help: See `MIGRATION_COMPLETE.md`
