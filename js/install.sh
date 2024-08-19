#!/bin/bash

# Define source and destination paths
SOURCE_DIR="zsh"
DEST_DIR="/c/Program Files/Git/usr/bin/"

# Copy zsh.exe and zsh-5.9.exe to the Git usr/bin directory
cp "$SOURCE_DIR/zsh.exe" "$DEST_DIR"
cp "$SOURCE_DIR/zsh-5.9.exe" "$DEST_DIR"

# Notify the user
echo "Copied zsh.exe and zsh-5.9.exe to $DEST_DIR"

# Install Zsh using the Oh My Zsh installation script
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Notify the user
echo "Zsh installation complete."