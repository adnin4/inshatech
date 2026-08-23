# 🆓 100% FREE N8N VPS & AUTONOMOUS AGENT DEPLOYMENT GUIDE

## 🎯 উদ্দেশ্য
একটি পয়সাও খরচ না করে সম্পূর্ণ বিনামূল্যে (100% Free Forever) **n8n Workflow Automation Engine** এবং **IINSHA AI Swarm** হোস্ট ও রান করার ৩টি পরীক্ষিত ও সেরা পদ্ধতি নিচে দেওয়া হলো।

---

## 🏆 পদ্ধতি ১: Oracle Cloud "Always Free" Tier (সর্বোত্তম ও সবচেয়ে শক্তিশালী)
**ফিচার:** ৪টি Ampere ARM CPU, ২৪ GB RAM, ২০০ GB NVMe SSD স্টোরেজ — আজীবন সম্পূর্ণ ফ্রি!

### ধাপ ১: ফ্রি একাউন্ট তৈরি
1. যান [oracle.com/cloud/free](https://www.oracle.com/cloud/free/)
2. একটি ফ্রি একাউন্ট সাইন-আপ করুন (যাচাইয়ের জন্য সাময়িক কার্ড ভেরিফিকেশন নেয়, কিন্তু $০ বিল কাটে)।
3. রিজিয়ন হিসেবে **Singapore** বা **Frankfurt** বেছে নিন।

### ধাপ ২: ফ্রি উবুন্টু ভিএম তৈরি
1. Oracle Cloud কনসোল থেকে **Compute** $\rightarrow$ **Instances** $\rightarrow$ **Create Instance**-এ ক্লিক করুন।
2. Image নির্বাচন করুন: **Ubuntu 24.04 LTS**
3. Shape নির্বাচন করুন: **Ampere ARM (VM.Standard.A1.Flex)** $\rightarrow$ **4 OCPU & 24 GB RAM** (Always Free Eligible).
4. SSH Key ডাউনলোড করে **Create** চাপুন।

### ধাপ ৩: ১-ক্লিকে n8n চালু করা
SSH দিয়ে সার্ভারে ঢুকে নিচের ৩টি কমান্ড রান করুন:
```bash
# ১. ডকার ইনস্টল করুন
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh

# ২. ডকার কম্পোজ দিয়ে n8n ও ভেক্টর ডাটাবেজ চালু করুন
sudo docker run -d --name iinsha_n8n \
  --restart always \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=IinshaSecret2026! \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n:latest
```
আপনার সার্ভারের আইপি `http://YOUR_SERVER_IP:5678`-এ গেলে লাইভ n8n চালু পাবেন!

---

## ⚡ পদ্ধতি ২: Cloudflare Tunnel + লোকাল ডকার (কোনো VPS ছাড়া সম্পূর্ণ জিরো খরচ)
আপনি আপনার নিজের ল্যাপটপ বা যেকোনো সাধারণ পিসিতে n8n চালু করে ক্লাউডফ্লেয়ার টানেলের মাধ্যমে বিশ্বব্যাপী লাইভ HTTPS ওয়েবহুক পেতে পারেন।

### ধাপসমূহ:
1. Docker Desktop চালু করুন (অথবা `npx n8n` টার্মিনালে চালান)।
2. টার্মিনালে চালান:
   ```bash
   docker run -d --name n8n_local -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
   ```
3. Cloudflare Tunnel দিয়ে বিশ্বের যে কারো জন্য লাইভ লিংক পেতে চালান:
   ```bash
   npx cloudflared tunnel --url http://localhost:5678
   ```
   টার্মিনালে সাথে সাথে একটি সুরক্ষিত লাইভ URL পাবেন (যেমন: `https://iinsha-swarm.trycloudflare.com`) যা আপনি আপনার ওয়েবসাইটের ওয়েবহুকে ব্যবহার করতে পারবেন!

---

## ☁️ পদ্ধতি ৩: Render / Koyeb ফ্রি ক্লাউড কন্টেইনার
1. যান [koyeb.com](https://www.koyeb.com/) বা [render.com](https://render.com/)
2. **Deploy Docker Image** সিলেক্ট করে ইমেজ দিন: `docker.n8n.io/n8nio/n8n:latest`
3. Port সেট করুন: `5678`
4. Deploy ক্লিক করলেই ইনস্ট্যান্ট ফ্রি সাবডোমেন (`https://iinsha-n8n.koyeb.app`) পেয়ে যাবেন!

---

## 🤖 কিভাবে এআই এজেন্ট স্বয়ংক্রিয়ভাবে লিড বের করবে ও লিঙ্ক পাঠাবে?

1. **অটোনোমাস লিড হান্টার ইঞ্জিন:** [`ai_brain/autonomous_lead_hunter.js`](file:///C:/Users/mahin%20khan/.gemini/antigravity/scratch/portfolio-showcase/ai_brain/autonomous_lead_hunter.js)
2. **এজ এপিআই এন্ডপয়েন্ট:** `/api/leads/prospect` (যা স্বয়ংক্রিয়ভাবে টার্গেটেড লিড, কোম্পানি এবং বাংলা/ইংরেজি সেলস মেসেজ তৈরি করে)।
3. **ট্র্যাকিং লিঙ্ক ফরম্যাট:**
   `https://inshatech.pages.dev/store.html?ref=autohunter&service=b2b-lead-swarm`
   (লিঙ্কে কাস্টমার প্রবেশ করলেই এআই কোপাইলট তাদের কনভিন্স করে চেকআউটে নিয়ে যাবে)।
