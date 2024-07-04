# HoYoLAB Auto Check-In

Simple HoYoLAB Auto Check-In. Free, One Time Set-up.

## How to Use:

1. Open Google Script: [Google Apps Script](https://script.google.com/home)
2. Create a New Project
3. Replace Everything with `autoDailyCheckIn.js`
4. Set your `ltoken_v2` and `ltuid_v2`
    - Google Chrome: Open Developer Tools (F12 or Ctrl+shift+I)
    - Go to `Application` tab.
    - Go to `Cookies` (double click)
    - Click `"https://act.hoyolab.com"`
    - From the list get `ltoken_v2` and `ltuid_v2` (double click + copy-paste) and replace it in the code:
    `"ltoken_v2=v2_XXXXX; ltuid_v2=XXXXX;"`
5. (Optional) Setup Discord Notification
    - Set `discord_notify` to `true`
    - Set `myDiscordID` to your Discord Id (or leave it empty)
    - Set `discordWebhook` url (Discord Server Setting > Integrations > Webhooks, Create New One and Copy Webhook URL)
6. For Auto Run Daily: Go to `Triggers` menu on the left side with clock icon
7. Click `Add Trigger` at the bottom right corner
8. Use this details:
   - Choose which function to run: `main`
   - Which runs at deployment: `Head`
   - Select event source: `time-driven`
   - Select type of time based trigger: `Day-timer`
   - Select time of day: Choose whenever server day reset or whenever you want, example server reset at 11pm UTC+7, so set it to `11pm to midnight` you can use this example too
   - Failure notification settings: `Notify me daily` just in case it doesn't work anymore you will get notified.

## FAQ

Q: Is it bannable?
A: No, I've been using this for years.

Q: It doesn't work anymore?
A: If you changed your password, `ltoken` will changed too, so get a new one.