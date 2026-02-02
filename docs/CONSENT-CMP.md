# Consent message (EEA / UK / Switzerland)

To collect consent from users in the European Economic Area (EEA), the UK, and Switzerland and avoid ad revenue loss, use **Google's CMP** (Consent Management Platform) via AdSense.

## What’s already done on the site

- **AdSense script** in the layout head (loads the CMP).
- **Referrer policy** `strict-origin-when-cross-origin` so the CMP can work.
- **`googlefc` init** so Google’s consent message can run.
- **“Privacy & cookie settings”** link in the footer so users can change their choices (re-opens the consent message).

## Create the consent message in AdSense

1. Sign in to [AdSense](https://www.google.com/adsense).
2. Go to **Privacy & messaging**.
3. Under **European regulations**:
   - First time: click **Create**.
   - Otherwise: click **Manage** → **Create message**.
4. **Select sites**: choose the sites where this message should show (e.g. spectr.no).
5. **Languages**: set default and any extra languages.
6. **User choices** (this is where you pick 2 vs 3 choices):
   - **“Do not consent” option**
     - **ON** → message has **3 choices**: **Consent**, **Do not consent**, **Manage options**.
     - **OFF** → message has **2 choices**: **Consent**, **Manage options**.
   - (Optional) **Close (do not consent)** → add a close icon so users can dismiss and decline consent.
7. **Message name**: internal name (e.g. “spectr EU consent”).
8. (Optional) Edit text and format.
9. **Privacy policy URL**: your site’s privacy policy.
10. Click **Publish** (or **Save draft** to test later).

Once published, the **same AdSense code** already on your site will show this message to eligible users (EEA/UK/CH). No extra code is required for the banner itself.

## Testing

- Use **Incognito** (or clear cookies) and visit your site from an EEA/UK/CH IP (or use a VPN) to see the message.
- To force the message to show for testing: add `?fc=alwaysshow&fctype=gdpr` to your site URL (see [Funding Choices API](https://developers.google.com/funding-choices/fc-api-docs)).

## Certified alternative CMP

If you prefer another **Google-certified CMP** (e.g. OneTrust, Cookiebot), you can use it instead of Google’s CMP. You would:

- Disable or not publish the European regulations message in AdSense, and
- Integrate the third-party CMP and ensure it works with [Consent Mode](https://support.google.com/google-ads/answer/10000067) / IAB TCF so AdSense respects consent.
