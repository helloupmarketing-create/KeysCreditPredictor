#!/bin/bash
echo "🚀 Updating GitHub Repository..."

# Push the changes
# We use --force to ensure your local version (the correct one) overwrites any conflicts on GitHub.
git push origin main --force

echo "✅ Update Complete!"
