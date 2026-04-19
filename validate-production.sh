#!/bin/bash

# Raadhyam Project - Production Readiness Validation Script
# This script helps verify that your setup is production-ready

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Functions
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1 ${BLUE}║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}\n"
}

print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $2"
        ((FAIL++))
    fi
}

print_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# Check if running from project root
if [ ! -f "README.md" ] || [ ! -d "Backend" ] || [ ! -d "Frontend" ]; then
    echo -e "${RED}Error: Please run this script from the Raadhyam project root directory${NC}"
    exit 1
fi

print_header "Raadhyam Portal - Production Readiness Check"

# Backend checks
print_header "Backend Validation"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_check 0 "Node.js installed: $NODE_VERSION"
else
    print_check 1 "Node.js is not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_check 0 "NPM installed: $NPM_VERSION"
else
    print_check 1 "NPM is not installed"
fi

# Check Backend .env
if [ -f "Backend/.env" ]; then
    print_check 0 "Backend .env file exists"
    
    # Check required vars in .env
    if grep -q "MONGODB_URL=mongodb" Backend/.env; then
        print_check 0 "MongoDB URL configured"
    else
        print_check 1 "MongoDB URL not properly configured"
    fi
    
    if grep -q "JWT_SECRET=" Backend/.env; then
        print_check 0 "JWT_SECRET configured"
    else
        print_check 1 "JWT_SECRET not configured"
    fi
    
    if grep -q "CLIENT_URL=" Backend/.env; then
        print_check 0 "CLIENT_URL configured"
    else
        print_check 1 "CLIENT_URL not configured"
    fi
else
    print_check 1 "Backend .env file missing (copy from .env.example)"
fi

# Check Backend dependencies
if [ -d "Backend/node_modules" ]; then
    print_check 0 "Backend node_modules installed"
else
    print_warn "Backend node_modules not installed. Run: cd Backend && npm install"
fi

# Check Backend structure
if [ -d "Backend/routes" ] && [ -d "Backend/controllers" ] && [ -d "Backend/models" ]; then
    print_check 0 "Backend directory structure correct"
else
    print_check 1 "Backend structure incomplete"
fi

# Check for critical files
if [ -f "Backend/server.js" ]; then
    print_check 0 "Backend server.js exists"
else
    print_check 1 "Backend server.js missing"
fi

# Frontend checks
print_header "Frontend Validation"

# Check Frontend .env
if [ -f "Frontend/.env.local" ] || [ -f "Frontend/.env" ]; then
    print_check 0 "Frontend environment file exists"
else
    print_warn "Frontend .env.local or .env not found. Create from .env.example"
fi

# Check Frontend dependencies
if [ -d "Frontend/node_modules" ]; then
    print_check 0 "Frontend node_modules installed"
else
    print_warn "Frontend node_modules not installed. Run: cd Frontend && npm install"
fi

# Check Frontend structure
if [ -d "Frontend/src" ] && [ -f "Frontend/src/main.jsx" ]; then
    print_check 0 "Frontend directory structure correct"
else
    print_check 1 "Frontend structure incomplete"
fi

# Security checks
print_header "Security Checklist"

# Check .gitignore
if grep -q ".env" .gitignore 2>/dev/null; then
    print_check 0 ".env is in .gitignore (secrets protected)"
else
    print_warn ".env might not be in .gitignore - verify manually"
fi

# Check NODE_ENV in .env
if grep -q "NODE_ENV=production" Backend/.env 2>/dev/null; then
    print_check 0 "NODE_ENV set to production"
else
    print_warn "NODE_ENV not set to production in Backend/.env"
fi

# Check JWT_SECRET length
if [ -f "Backend/.env" ]; then
    JWT_SECRET=$(grep "JWT_SECRET=" Backend/.env | cut -d '=' -f 2)
    if [ ${#JWT_SECRET} -gt 20 ]; then
        print_check 0 "JWT_SECRET is sufficiently long"
    else
        print_warn "JWT_SECRET might be too short (should be 32+ characters)"
    fi
fi

# Dependency checks
print_header "Required Dependencies"

# Check critical packages
PACKAGES=("mongoose" "express" "jsonwebtoken" "bcryptjs" "cloudinary")

for package in "${PACKAGES[@]}"; do
    if grep -q "\"$package\"" Backend/package.json; then
        print_check 0 "$package is listed in dependencies"
    else
        print_check 1 "$package is MISSING from Backend/package.json"
    fi
done

# Check security packages
SECURITY_PACKAGES=("helmet" "cors" "express-rate-limit" "express-validator")

for package in "${SECURITY_PACKAGES[@]}"; do
    if grep -q "\"$package\"" Backend/package.json; then
        print_check 0 "$package installed (security)"
    else
        print_check 1 "$package MISSING (security risk)"
    fi
done

# MongoDB check
print_header "Database Configuration"

if command -v mongosh &> /dev/null; then
    print_check 0 "MongoDB Shell (mongosh) is available"
elif command -v mongo &> /dev/null; then
    print_check 0 "MongoDB client is available"
else
    print_warn "MongoDB client not found (you can still use MongoDB Atlas)"
fi

# API endpoint checks
print_header "API Routes"

ROUTES_FILE="Backend/routes"
if grep -r "export.*router" "$ROUTES_FILE" > /dev/null 2>&1; then
    print_check 0 "Route files are using proper exports"
else
    print_check 1 "Some routes might not be properly exported"
fi

# Summary
print_header "Summary"

echo -e "${GREEN}Passed:${NC} $PASS checks"
echo -e "${RED}Failed:${NC} $FAIL checks"
echo -e "${YELLOW}Warnings:${NC} $WARN checks"

echo -e "\n${BLUE}Total Score: $(($PASS * 100 / ($PASS + $FAIL + $WARN)))%${NC}\n"

# Final recommendations
print_header "Next Steps"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ Your project appears to be production-ready!${NC}\n"
    echo "Recommended actions:"
    echo "  1. Run: cd Backend && npm run seed:admin"
    echo "  2. Test backend: npm run dev"
    echo "  3. Build frontend: cd Frontend && npm run build"
    echo "  4. Deploy to production (see DEPLOYMENT.md)"
else
    echo -e "${RED}⚠ Please fix the $FAIL failed checks before deploying${NC}\n"
    echo "Recommended actions:"
    echo "  1. Review the failed checks above"
    echo "  2. Setup .env files from .env.example"
    echo "  3. Install dependencies: npm install"
    echo "  4. Re-run this validation script"
fi

if [ $WARN -gt 0 ]; then
    echo -e "\n${YELLOW}Note:${NC} Address $WARN warnings for better security and performance"
fi

echo ""

# Exit with appropriate code
if [ $FAIL -gt 0 ]; then
    exit 1
else
    exit 0
fi
