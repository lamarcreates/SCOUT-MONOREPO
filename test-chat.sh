#!/bin/bash

echo "Testing MotorScout Chat with Tool Calling"
echo "=========================================="
echo ""

# Test 1: Search for SUVs
echo "Test 1: Searching for SUVs under $40,000"
curl -X POST http://localhost:4200/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Show me SUVs under $40,000"}
    ]
  }' \
  -s | head -c 500
echo -e "\n\n"

# Test 2: Ask about specific vehicle
echo "Test 2: Asking about Toyota RAV4"
curl -X POST http://localhost:4200/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Tell me about the Toyota RAV4 Hybrid"}
    ]
  }' \
  -s | head -c 500
echo -e "\n\n"

# Test 3: Schedule test drive
echo "Test 3: Scheduling a test drive"
curl -X POST http://localhost:4200/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "I would like to schedule a test drive for the Camry tomorrow at 2pm"}
    ]
  }' \
  -s | head -c 500
echo -e "\n\n"

echo "Tests complete!"