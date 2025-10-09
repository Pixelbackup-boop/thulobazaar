# 🛡️ ThuLoBazaar - Development Policy & Guidelines

## ⚠️ CRITICAL RULE: PRESERVE EXISTING CODE

### 🚨 DO NOT DELETE OR MODIFY WITHOUT PERMISSION

**Golden Rule:** If ANYTHING exists (files, components, features, functions, code blocks) but appears "unused" or "inactive" - **DO NOT touch them!**

**This includes:**
- ❌ Files
- ❌ Components within files
- ❌ Features within components
- ❌ Functions within features
- ❌ Code blocks within functions
- ❌ Props, state variables, hooks
- ❌ API endpoints, routes
- ❌ Database fields, tables
- ❌ CSS classes, styles
- ❌ Comments, TODOs
- ❌ Imports that seem unused
- ❌ ANYTHING that looks "old" or "unused"

---

## 📋 Development Guidelines

### 1. **Existing Code is Sacred**

- ✅ **Always assume** existing files have a purpose
- ✅ **Always ask** before deleting or modifying anything
- ✅ **Never remove** "inactive" or "commented" code
- ✅ **Keep** all existing routes, components, and files
- ❌ **Never assume** something is "old" or "unused"
- ❌ **Never "clean up"** code without explicit permission

### 2. **Why Code May Appear Inactive or "Old"**

Code/features might exist but not appear active because:
- 🔮 **Planned for future use** - Will be activated later
- 🚧 **Work in progress** - Being developed incrementally
- 🧪 **Experimental features** - Testing before activation
- 📦 **Staged rollout** - Will enable when ready
- 🔄 **Migration in progress** - Transitioning systems
- 🎯 **Feature flags** - Controlled activation planned
- 📝 **Plan changed, but code updated** - What looks "old" is actually current!

**⚠️ IMPORTANT: Plans Change!**
- We often change plans and implement the updated version
- Old plan documentation ≠ Old code
- Code that looks like "old plan" might be "new implementation"
- **Never assume based on documentation age or comments**
- **Always ask to explain** what the code does NOW

### 3. **Before Making Changes**

**Step 1: STOP and ASK**
```
❓ Questions to ask the user:
- "I see [filename]. Should I modify/delete this?"
- "This appears inactive. Is it needed for future use?"
- "Can I remove this, or is it planned for later?"
```

**Step 2: WAIT for confirmation**
- ✅ Get explicit "yes, delete it" or "yes, modify it"
- ❌ Don't proceed without clear permission

**Step 3: Document the decision**
- Keep track of what was changed and why
- Update relevant documentation

---

## 🗂️ Examples of "Inactive but Intentional" Code

### 1. Files That May Look Unused But Aren't:

1. **Backup/Old Files:**
   - `AdDetail.backup.jsx`
   - `Profile.backup.jsx`
   - **Status:** Kept for reference, don't delete

2. **Duplicate Routes:**
   - `backend/routes/ads.js`
   - `backend/routes/adRoutes.js`
   - **Status:** May merge later, keep both for now

3. **Multiple Profile Routes:**
   - `backend/routes/profile.js`
   - `backend/routes/profiles.js`
   - `backend/routes/profileRoutes.js`
   - **Status:** Being consolidated, keep all

4. **Inactive Middleware:**
   - Authentication temporarily disabled for dev
   - Rate limiting configured but not enforced
   - **Status:** Will activate in production

5. **Unused Database Fields:**
   - Fields populated but not displayed in UI yet
   - **Status:** Frontend pending, backend ready

6. **Commented Code:**
   - Editor auth temporarily commented out
   - Feature flags for future features
   - **Status:** Will uncomment when ready

---

## 🔄 Safe Development Workflow

### When Adding New Features:

1. **READ existing code first**
   - Understand what's already there
   - Check for similar functionality

2. **ADD, don't replace**
   - Create new files alongside old ones
   - Extend, don't overwrite

3. **INTEGRATE carefully**
   - Connect to existing systems
   - Maintain backward compatibility

4. **TEST with existing features**
   - Ensure nothing breaks
   - Verify all flows still work

### When You Think Something Should Be Deleted:

```
🛑 STOP! Follow this checklist:

□ Have I asked the user first?
□ Have I searched if it's used anywhere?
□ Have I checked git history for context?
□ Have I considered if it's for future use?
□ Have I received explicit permission to delete?

If ALL answers are YES → Proceed
If ANY answer is NO → ASK FIRST
```

---

## 📝 Code Review Principles

### What TO Do: ✅

- ✅ **Add new functionality** without breaking old
- ✅ **Fix bugs** in existing code
- ✅ **Improve performance** while maintaining behavior
- ✅ **Add documentation** to existing files
- ✅ **Refactor with permission** after asking
- ✅ **Create new files** for new features
- ✅ **Ask questions** when unsure

### What NOT To Do: ❌

- ❌ **Delete "unused" files** without asking
- ❌ **Remove "old" code** without permission
- ❌ **Modify core logic** without discussion
- ❌ **"Clean up" commented code**
- ❌ **Remove duplicate files** without asking
- ❌ **Assume anything is obsolete**
- ❌ **Make breaking changes** without approval

---

## 🎯 Current Project Status

### Known "Inactive but Intentional" Items:

1. **Editor Authentication (Temporarily Disabled)**
   ```javascript
   // backend/routes/editor.js
   // TEMPORARILY DISABLED FOR DEVELOPMENT
   // router.use(authenticateToken);
   // router.use(requireEditor);
   ```
   **Status:** Will re-enable in production

2. **Multiple Route Files**
   - Various route files with similar names
   **Status:** Being organized, keep all for now

3. **Backup Components**
   - `*.backup.jsx` files
   **Status:** Reference files, do not delete

4. **Migration Files**
   - Some migrations applied, some pending
   **Status:** Apply when ready, don't delete

5. **Typesense Data Directory**
   - Contains search engine data
   **Status:** Active, never delete

6. **Unused CSS/Styles**
   - Some components have prepared styles
   **Status:** Will be used when features activate

---

## 🚀 Adding New Features Safely

### Safe Addition Pattern:

```javascript
// ✅ GOOD: Add new without removing old
export const NewComponent = () => {
  // New implementation
};

// Keep old component for now
export const OldComponent = () => {
  // Old implementation - KEEP THIS
};
```

### Unsafe Deletion Pattern:

```javascript
// ❌ BAD: Removing "old" code
// Removed OldComponent because it looks unused
// (But it might be used somewhere or planned for later!)
```

---

## 📋 When You're Unsure - Ask!

### Template Questions:

**For Files:**
> "I see `[filename]` which appears to [describe state]. Should I:
> - Keep it as is?
> - Modify it for [purpose]?
> - Delete it?
>
> What's the plan for this file?"

**For Code:**
> "This code block in `[file]:[line]` seems [inactive/unused/duplicate].
> Is this intentional? Should I:
> - Leave it alone?
> - Activate/modify it?
> - Remove it?"

**For Database:**
> "I see table/column `[name]` that doesn't seem used in the UI.
> Is this for a future feature? Should I integrate it now or leave it?"

---

## 🎓 Learning from Mistakes

### If You Accidentally Delete/Modify:

1. **Stop immediately**
2. **Check git history:** `git log --all --oneline --graph`
3. **Restore if needed:** `git checkout [commit] -- [file]`
4. **Inform the user** what happened
5. **Ask for guidance** on next steps

### Prevention:

- Always work in a **git branch**
- **Commit frequently** with clear messages
- **Test thoroughly** before committing
- **Review changes** before pushing
- **Ask early** rather than assume

---

## 📊 File Status Legend

Use this to track file status:

| Status | Meaning | Action |
|--------|---------|--------|
| ✅ **Active** | In use, fully implemented | Safe to modify with care |
| 🚧 **WIP** | Work in progress | Don't touch unless asked |
| 🔮 **Planned** | For future use | Keep, don't delete |
| 🧪 **Experimental** | Testing phase | Don't modify |
| 📦 **Staged** | Ready to activate | Don't change |
| 🗃️ **Backup** | Reference copy | Never delete |
| ❓ **Unknown** | Purpose unclear | **ASK FIRST!** |

---

## 🛡️ Project Integrity Rules

### Core Principles:

1. **Preservation First**
   - When in doubt, preserve
   - Better to have unused code than missing code
   - Disk space is cheap, re-writing is expensive

2. **Incremental Changes**
   - Small, tested changes only
   - One feature at a time
   - Verify before moving forward

3. **Communication Always**
   - Ask questions frequently
   - Clarify intentions
   - Confirm before action

4. **Backward Compatibility**
   - Don't break existing features
   - Maintain API contracts
   - Support legacy code paths

5. **Git as Safety Net**
   - Commit before major changes
   - Branch for new features
   - Keep history clean but complete

---

## ✅ Summary Checklist

Before touching ANY file OR any code within it:

- [ ] Have I read and understood this policy?
- [ ] Have I checked if this **file** is intentionally inactive?
- [ ] Have I checked if this **code/component** is intentionally inactive?
- [ ] Have I considered that plans may have changed (code updated, names stayed)?
- [ ] Have I asked the user to explain what this code does NOW?
- [ ] Have I asked the user about this change?
- [ ] Have I received explicit permission?
- [ ] Have I committed recent work to git?
- [ ] Do I have a backup/rollback plan?
- [ ] Have I tested that existing features still work?

**If all checked: Proceed carefully**
**If any unchecked: STOP and ASK**

**Remember:**
- Don't just check files - check components, functions, props, everything!
- Variable names might not match current purpose (plans evolved)
- "Unused" might mean "ready for activation"
- "Old-looking" might be "current implementation with legacy name"

---

## 📞 When to Ask (Always!)

**Ask about:**
- ❓ Any file deletion
- ❓ Any component/function removal (even within files)
- ❓ Any "cleanup" or "refactoring"
- ❓ Any deprecation of code
- ❓ Any removal of routes/endpoints
- ❓ Any database schema changes
- ❓ Any modification to core logic
- ❓ Any "unused" feature removal
- ❓ Any removal of props, imports, hooks
- ❓ Any deletion of commented code
- ❓ Any "fixing" of variable names
- ❓ Any removal of "duplicate" code
- ❓ Anything that looks "old" based on name
- ❓ Anything you're unsure about

**Don't ask (safe to do):**
- ✅ Adding new features (that don't remove old)
- ✅ Fixing obvious bugs
- ✅ Adding documentation/comments
- ✅ Improving existing code without breaking
- ✅ Adding new files for new features

---

## 🧩 Code Within Files - CRITICAL RULES

### ⚠️ It's Not Just Files - It's EVERYTHING Inside Them!

**DO NOT remove or change:**
- ❌ Components within files
- ❌ Functions within components
- ❌ Features within functions
- ❌ Props, parameters, arguments
- ❌ State variables, hooks
- ❌ API endpoints, routes
- ❌ Database fields in queries
- ❌ CSS classes, selectors
- ❌ Comments, TODOs, notes
- ❌ Imports (even if look unused)
- ❌ Exports (even if not imported yet)
- ❌ Conditional logic blocks
- ❌ Helper functions
- ❌ Constants, config values

### 📝 Examples of "Looks Old But Is Current":

**Example 1: Field Names vs Usage**
```javascript
// Looks like "old plan" subscription model
business_subscription_status: 'approved'

// Actually used for "new plan" verification
// Just reused the field name!
// Status: ✅ CURRENT - don't change!
```

**Example 2: Component Names**
```jsx
// Component: BusinessProfile.jsx
// You think: "But we don't have business accounts anymore!"
// Reality: We show business verification info here
// Status: ✅ CURRENT - component repurposed
```

**Example 3: Unused Props**
```jsx
<AdCard
  id={ad.id}
  title={ad.title}
  isFeatured={ad.isFeatured}  // Not used in UI yet
  isUrgent={ad.isUrgent}      // Not used in UI yet
/>
// Status: ✅ Props ready for feature activation
```

**Example 4: Commented Code**
```javascript
// if (user.business_verified) {
//   discount = 0.35; // 35% discount
// }
// Status: ✅ Waiting for payment integration
```

### 🔄 Why Plans Change But Code Names Don't:

1. **Field Names Reused**
   - `business_subscription_status` → Now stores verification status
   - Faster to reuse than rename everywhere

2. **Component Names Kept**
   - `BusinessProfile.jsx` → Now shows verification info
   - Renaming = risk of breaking imports

3. **Variable Names Historic**
   - `subscriptionId` → Actually stores verification request ID
   - Code works, naming is legacy

**The Rule:**
> **Name doesn't always match current purpose when plans evolve.
> Always ask what it does NOW, not what the name suggests!**

### 🚫 Never Assume Based On:

- ❌ Old documentation
- ❌ Variable/function names
- ❌ Comment dates
- ❌ What "should" be there
- ❌ What "looks" unused
- ❌ What "seems" duplicate

### ✅ Always Ask:

> "I see [code/feature/component] that [describe what you see].
> Based on [reason], I think it's [old/unused/duplicate].
>
> Can you explain what this does NOW?
> Should I:
> - Keep it as is?
> - Modify it?
> - Remove it?"

---

## 🎯 Development Mantra

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   "If it exists, there's a reason."              │
│                                                  │
│   "When unsure, ask."                            │
│                                                  │
│   "Preserve first, optimize later."              │
│                                                  │
│   "Plans change, names stay.                     │
│    What it's CALLED ≠ What it DOES."             │
│                                                  │
│   "Breaking things is easy,                      │
│    fixing assumptions is hard."                  │
│                                                  │
│   "ASK ABOUT CODE, NOT JUST FILES!"              │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

**Remember:** This codebase is 75% complete. Almost EVERYTHING has a purpose, even if not immediately obvious.

**This applies to:**
- Files (don't delete)
- Components within files (don't remove)
- Functions within components (don't change)
- Features within functions (don't modify)
- Props, imports, styles (don't clean up)
- Database fields, API routes (don't "fix")
- ANYTHING that exists (don't assume it's old)

**When plans change, code gets updated but names often stay the same!**

**ASK FIRST, CODE SECOND!** 🛡️
