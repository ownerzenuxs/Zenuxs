#!/bin/sh

cd /home/container/github-files || exit

# Ensure correct Git user details
git config --global user.email "iwantvpspls@gamil.com"
git config --global user.name "ownerzenuxs"

# Add changes and commit
git add .
git commit -m "Auto-update: $(date)"

# Push to GitHub
git push origin main
