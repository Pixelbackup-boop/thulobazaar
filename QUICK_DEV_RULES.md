# ⚡ Quick Development Rules

## 🚨 STOP! Read This Before Coding

### The Golden Rule:
```
If ANYTHING exists (files, components, functions, props, anything)
→ ASK FIRST before deleting or changing!
```

---

## ❌ DO NOT Touch Without Asking:

| What | Example | Why |
|------|---------|-----|
| **Files** | `Profile.backup.jsx` | Might be reference/planned |
| **Components** | `BusinessProfile` | Might be repurposed |
| **Functions** | `calculateDiscount()` | Might be for future feature |
| **Props** | `isFeatured, isUrgent` | Ready for activation |
| **Imports** | `import { unused }` | Used in commented code |
| **Database fields** | `subscription_status` | Repurposed for verification |
| **Routes/APIs** | `/api/business/info` | Frontend not integrated yet |
| **CSS classes** | `.verified-badge-gold` | Waiting for feature |
| **Comments** | `// Premium feature` | Will uncomment later |
| **State/Hooks** | `const [notif, setNotif]` | UI pending |

---

## ⚠️ Why Code Looks "Old" But Isn't:

### Plans Changed → Code Updated → Names Stayed Same

**Example:**
```javascript
// OLD PLAN: Monthly subscriptions
// NEW PLAN: One-time verification fee
// CODE: Still uses "subscription_status" field
// WHY: Reused field, faster than renaming everywhere
// STATUS: ✅ CURRENT implementation!
```

**What You See ≠ What It Does**
- Field: `business_subscription_status`
- Actual use: Stores verification status
- Reason: Plan changed, field repurposed
- Action: **DON'T "fix" the name!**

---

## ✅ Safe to Do (No Permission Needed):

- ✅ Add NEW features (without removing old)
- ✅ Fix obvious bugs
- ✅ Add documentation/comments
- ✅ Improve code WITHOUT breaking it
- ✅ Create NEW files for NEW features

---

## 🛑 Always Ask About:

- ❓ Any deletion (files, code, props, anything)
- ❓ Any "cleanup" or "refactoring"
- ❓ Any "unused" code removal
- ❓ Any removal of "duplicate" code
- ❓ Any "fixing" of variable names
- ❓ Anything that looks "old"
- ❓ Anything you're unsure about

---

## 💬 Template Questions:

### For Code:
```
"I see [component/function/prop] in [file] that appears [unused/old/duplicate].

Based on [reason], I think it's [assessment].

Can you explain what this does NOW?

Should I:
- Keep it as is?
- Modify it?
- Remove it?"
```

### For Fields/Variables:
```
"I see field/variable '[name]' which suggests [old purpose].

But the plan says [new purpose].

Is this:
- Old code that needs updating?
- Current code with legacy name?
- Something else?

What does this do NOW?"
```

---

## 🎯 Quick Decision Tree:

```
Want to delete/modify something?
    ↓
Does it exist in the codebase?
    ↓ YES
Is it OBVIOUSLY broken/unused?
    ↓ NO (or unsure)
STOP! → ASK FIRST
    ↓ Get Answer
User says OK?
    ↓ YES
Proceed carefully
    ↓
Test thoroughly
```

---

## 📝 Common Scenarios:

### Scenario 1: "This component seems unused"
❌ **Wrong:** Delete it
✅ **Right:** Ask: "Is BusinessProfile.jsx used? Seems like duplicate of SellerProfile"

### Scenario 2: "This field name doesn't match the plan"
❌ **Wrong:** Rename `subscription_status` to `verification_status`
✅ **Right:** Ask: "Does subscription_status store verification data now?"

### Scenario 3: "This import isn't used anywhere"
❌ **Wrong:** Remove the import
✅ **Right:** Ask: "Is this import for a future feature? Can I remove it?"

### Scenario 4: "This code is commented out"
❌ **Wrong:** Delete commented code
✅ **Right:** Ask: "Is this commented code waiting for payment integration?"

### Scenario 5: "There are 3 similar profile routes"
❌ **Wrong:** Consolidate into one
✅ **Right:** Ask: "Can I merge profile.js, profiles.js, profileRoutes.js?"

---

## 🔑 Key Insights:

1. **75% Complete Project** = Most code has a purpose
2. **Plans Evolve** = Names don't always match current use
3. **Reuse > Rename** = Faster to repurpose than refactor
4. **Inactive ≠ Unused** = May be waiting for activation
5. **Ask Early** = Prevents breaking things

---

## 🎓 Remember:

```
┌─────────────────────────────────────────┐
│                                         │
│  "Plans change, names stay.             │
│   What it's CALLED ≠ What it DOES."     │
│                                         │
│  "ASK ABOUT CODE, NOT JUST FILES!"      │
│                                         │
│  "When unsure, ASK."                    │
│                                         │
└─────────────────────────────────────────┘
```

---

**Full Policy:** [DEVELOPMENT_POLICY.md](DEVELOPMENT_POLICY.md)

**Before ANY change:** Read the policy, then ASK! 🛡️
