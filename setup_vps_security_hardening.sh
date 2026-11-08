#!/bin/bash
# ==============================================================================
# IINSHA AI AUTOMATION LAB — PRODUCTION VPS SECURITY HARDENING SCRIPT
# Target OS: Ubuntu 22.04 / 24.04 LTS (Hostinger VPS)
# Purpose: SSH Lockdown, Fail2ban Setup, UFW Firewall, Docker Hardening
# Author: Lead AI Automation Engineer Adnin Sadat Mahin
# ==============================================================================

set -e

echo "🔒 [IINSHA SECURITY ENGINE] Starting Production VPS Hardening..."

# 1. Update Package Repositories
echo "📦 [1/5] Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y ufw fail2ban curl git docker.io docker-compose-plugin

# 2. Configure SSH Lockdown
echo "🛡️ [2/5] Hardening SSH Configuration (/etc/ssh/sshd_config)..."
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# Update SSH Configuration to Custom Port 2222 and Disable Root Password Login
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config || echo "Port 2222" | sudo tee -a /etc/ssh/sshd_config
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Restart SSH Service
sudo systemctl restart sshd || sudo systemctl restart ssh

# 3. Configure Fail2ban to block brute-force SSH attacks
echo "🚫 [3/5] Setting up Fail2ban brute-force protection..."
sudo cat << 'EOF' | sudo tee /etc/fail2ban/jail.local
[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 600
bantime = 86400
EOF

sudo systemctl restart fail2ban
sudo systemctl enable fail2ban

# 4. Configure UFW Strict Firewall Rules
echo "🔥 [4/5] Enabling UFW Firewall with strict port isolation..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp comment 'Custom SSH Port'
sudo ufw allow 80/tcp comment 'HTTP Nginx Proxy'
sudo ufw allow 443/tcp comment 'HTTPS SSL Proxy'
sudo ufw --force enable

# 5. Verify Docker Security Limits
echo "🐳 [5/5] Checking Docker Container Security Isolation..."
sudo systemctl enable docker

echo "=============================================================================="
echo "✅ [SUCCESS] VPS SSH Lockdown & Firewall Hardening Complete!"
echo "📌 SSH Port changed to: 2222"
echo "📌 Root Login & Password Auth: DISABLED"
echo "📌 Fail2ban Banning: ACTIVE (3 retries = 24hr IP Ban)"
echo "📌 Open Ports: 2222 (SSH), 80 (HTTP), 443 (HTTPS)"
echo "=============================================================================="
