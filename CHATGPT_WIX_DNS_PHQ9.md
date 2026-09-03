# ChatGPT paste: Wix DNS for PHQ-9

Copy everything below the line into ChatGPT.

---

I need Wix DNS only for this host:

https://phq9.yuriybortnik.com

This is a patient screener already live on GitHub Pages.
Repo: bortniky-dotcom/scale-phq9-screener
Pages target: bortniky-dotcom.github.io
Do not create a Wix page. Do not embed the form. Do not assign this host to the Wix website.

Do not touch:
- ocdquiz.yuriybortnik.com
- bpdquiz.yuriybortnik.com
- fw-ocs.yuriybortnik.com
- www.yuriybortnik.com/fw-ocs
- www.yuriybortnik.com/adhdchildcustom
- www.yuriybortnik.com/phq9

Wix clicks, in order. One action per line.

1. Open the Wix dashboard for the ReadyWell / yuriybortnik.com site.
2. Settings.
3. Domains.
4. Click yuriybortnik.com.
5. Open DNS.
6. Add a CNAME record. Not an A record. Not a redirect.
7. Host / Name: phq9
8. Points to / Value / Hostname: bortniky-dotcom.github.io
9. TTL: default.
10. Save.
11. Do NOT click Connect to Wix.
12. Do NOT click Assign to site.
13. Do NOT add phq9.yuriybortnik.com to the Wix connected-domains list.
14. If Wix already connected phq9 as a site domain, disconnect it. Keep the DNS CNAME row only.
15. Confirm the row reads: CNAME / phq9 / bortniky-dotcom.github.io

Wrong hosts. Do not create these:
- screener
- scale-phq9-screener
- scale-phq9
- phq-9
- www.phq9

Correct host is only: phq9
Correct public URL is only: https://phq9.yuriybortnik.com

When done, print:
- the exact DNS row you added
- whether the host is assigned to the Wix site (it must be no)
- https://phq9.yuriybortnik.com
