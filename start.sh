#!/bin/bash
echo "========================================"
echo "   Career Lab - Local Setup"
echo "========================================"
echo

if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "Installing dependencies..."
npm run install:all

echo "Setting up local database..."
npm run setup-local

echo "Starting Career Lab..."
echo
echo "========================================"
echo " App will open at http://localhost:3000"
echo " Press Ctrl+C to stop the server"
echo "========================================"
echo

npm run dev-local