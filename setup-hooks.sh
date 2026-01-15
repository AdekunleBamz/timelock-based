#!/bin/bash

# Git hook setup script
# Run this script to install git hooks

echo "Setting up git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy hooks from .githooks to .git/hooks
if [ -d ".githooks" ]; then
  for hook in .githooks/*; do
    hook_name=$(basename "$hook")
    echo "Installing $hook_name..."
    cp "$hook" ".git/hooks/$hook_name"
    chmod +x ".git/hooks/$hook_name"
  done
  echo "✅ Git hooks installed successfully!"
else
  echo "❌ .githooks directory not found"
  exit 1
fi

# Configure git to use .githooks directory
git config core.hooksPath .githooks

echo "✅ Git hooks configuration complete!"
echo "Hooks will now run automatically on git commands."
