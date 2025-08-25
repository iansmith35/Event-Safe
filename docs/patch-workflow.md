# Patch Application Workflow

This repository includes a GitHub Action workflow that automatically applies patches from issue comments.

## How to Use

1. **Create or find an issue** where you want to apply a patch
2. **Comment on the issue** with the following format:

```
/apply-patch

Here's the patch to fix the issue:

```patch
diff --git a/path/to/file.js b/path/to/file.js
index 1234567..abcdefg 100644
--- a/path/to/file.js
+++ b/path/to/file.js
@@ -1,3 +1,3 @@
 function example() {
-  return "old code";
+  return "new code";
 }
```

```

## What Happens Next

The workflow will automatically:

1. ✅ **Extract the patch** from your comment
2. ✅ **Create a new branch** named `chatgpt/update-<timestamp>`
3. ✅ **Apply the patch** to the codebase
4. ✅ **Commit the changes** with "Repo Bot" as author
5. ✅ **Create a Pull Request** targeting the main branch
6. ✅ **Reply to your issue** with the PR link

## Requirements

- Your comment must contain `/apply-patch`
- Your patch must be enclosed in ````patch` code blocks
- The patch must be in valid unified diff format
- The patch must apply cleanly to the current codebase

## Error Handling

If the patch fails to apply, the workflow will:
- ❌ Comment on the issue explaining the failure
- 🔗 Provide a link to the workflow logs for debugging
- 💡 Suggest common fixes

## Example Patch Format

```patch
diff --git a/src/example.js b/src/example.js
index 1234567..abcdefg 100644
--- a/src/example.js
+++ b/src/example.js
@@ -10,7 +10,7 @@ function processData(data) {
   if (!data) {
-    return null;
+    return [];
   }
   
   return data.map(item => ({
```

## Security Notes

- The workflow only runs on issue comments containing the specific trigger
- All changes go through a Pull Request for review before merging
- The bot commits are clearly attributed and traceable
- Workflow logs provide full audit trail of changes