# 🏛️ IINSHA AI-BOS: CLOUDFLARE FINAL BASELINE & ARCHITECTURAL TRUTH

```text
================================================================================
          👑 IINSHA AI-BOS: CLOUDFLARE CONFIGURATION & BASELINE AUDIT
================================================================================
  [✓] 1. Cloudflare Project Name  : inshatech
  [✓] 2. Connected GitHub Repo    : adnin4/inshatech
  [✓] 3. Canonical Production Branch: master
  [✓] 4. Current Master Head      : 3d9c2c5
  [✓] 5. Build Command Standard   : node scripts/build_pages.mjs (Platform-Agnostic / 0s / pure Node.js)
  [✓] 6. Build Output Directory   : . (Root Directory containing index.html, store.html, etc.)
  [✓] 7. Node Runtime Version     : Node 22 (.nvmrc & .node-version enforced)
  [✓] 8. Functions Routing Support: functions/ (Cloudflare Pages Native API)
  [✓] 9. Preview Branch Control   : PR branches build isolated preview environments
  [✓] 10. Rollback Capability     : 1-click atomic instant rollback to known-good deployment
================================================================================
```

---

## 🔍 ১. ক্লাউডফ্লেয়ার পেজেস বিল্ড কনফিগারেশন রুট-কজ (Cloudflare Build Invariants):

1. **রুট ডিরেক্টরি (Root Directory):** `.` (Root)
2. **বিল্ড কমান্ড (Build Command):** `node scripts/build_pages.mjs`
   * স্ক্রিপ্টটি কোনো এক্সটারনাল প্যাকেজ নির্ভরতা ছাড়াই পিওর স্ট্যান্ডার্ড লাইব্রেরি (`node:fs`, `node:path`) ব্যবহার করে ০ সেকেন্ডে সফলভাবে এক্সিট (Code 0) করে।
3. **আউটপুট ডিরেক্টরি (Output Directory):** `.`
   * রুট ডিরেক্টরিতে `index.html`, `store.html`, `marketplace.html`, `style.css`, `app.js` ইত্যাদি সমস্ত স্ট্যাটিক ফাইল সরাসরি প্রস্তুত থাকে।
4. **নোড এনভায়রনমেন্ট (Node Runtime):**
   * `.nvmrc` এবং `.node-version` ফাইলে `22` এনফোর্স করা হয়েছে যাতে ক্লাউডফ্লেয়ার বিল্ড কনটেইনারে কোনো ইঞ্জিন কনফ্লিক্ট না হয়।
