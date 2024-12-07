const profiles = [
    {
        token: "ltoken_v2=v2_XXXXX; ltuid_v2=XXXXX;",
        zzz: true,
        genshin: false,
        honkai_star_rail: false,
        honkai_3: false,
        accountName: "ADD UNQIUE IDENTIFIER FOR YOUR ACCOUNT HERE"
    }
];

/** Discord Notification **/
const discord_notify = false;
const myDiscordID = "INSERT YOUR DISCORD ID IF YOU WANT TO GET PING, OR YOU CAN LEAVE IT EMPTY";
const discordWebhook =
    "INSERT YOUR WEBHOOK HERE";

/** This code is based on canaria3406 and modified by Areha11Fz **/
/** The following is the script code. Please DO NOT modify. **/

const urlDict = {
    ZZZ:
        "https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/sign?lang=en-us&act_id=e202406031448091",
    Genshin:
        "https://sg-hk4e-api.hoyolab.com/event/sol/sign?lang=en-us&act_id=e202102251931481",
    Star_Rail:
        "https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=en-us&act_id=e202303301540311",
    Honkai_3:
        "https://sg-public-api.hoyolab.com/event/mani/sign?lang=en-us&act_id=e202110291205111"
};

async function main() {
    const messages = await Promise.all(profiles.map(autoSignFunction));
    const hoyolabResp = `${messages.join("\n\n")}`;

    if (discord_notify == true) {
        if (discordWebhook) {
            postWebhook(hoyolabResp);
        }
    }
}

function discordPing() {
    if (myDiscordID) {
        return `<@${myDiscordID}> `;
    } else {
        return "";
    }
}

function autoSignFunction({ token, zzz, genshin, honkai_star_rail, honkai_3, accountName }) {
    const urls = [];

    if (zzz) urls.push(urlDict.ZZZ);
    if (genshin) urls.push(urlDict.Genshin);
    if (honkai_star_rail) urls.push(urlDict.Star_Rail);
    if (honkai_3) urls.push(urlDict.Honkai_3);

    const baseHeader = {
        Cookie: token,
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "x-rpc-app_version": "2.34.1",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "x-rpc-client_type": "4",
        Referer: "https://act.hoyolab.com/",
        Origin: "https://act.hoyolab.com"
    };

    // Build a separate request for each URL with the correct x-rpc-signgame header
    const httpRequests = urls.map(url => {
        const headers = { ...baseHeader };
        if (url === urlDict.ZZZ) headers["x-rpc-signgame"] = "zzz";
        if (url === urlDict.Star_Rail) headers["x-rpc-signgame"] = "honkai_star_rail";
        if (url === urlDict.Genshin) headers["x-rpc-signgame"] = "genshin";
        if (url === urlDict.Honkai_3) headers["x-rpc-signgame"] = "honkai_3";

        return {
            url,
            method: "POST",
            headers,
            muteHttpExceptions: true
        };
    });

    let response = `${accountName}`;
    let retry = false;

    do {
        const httpResponses = UrlFetchApp.fetchAll(httpRequests);

        for (const [i, hoyolabResponse] of httpResponses.entries()) {
            const result = JSON.parse(hoyolabResponse);
            const checkInResult = result.message;
            const gameName = Object.keys(urlDict)
                .find(key => urlDict[key] === urls[i])
                ?.replace(/_/g, " ");
            const isError = checkInResult != "OK";
            const bannedCheck = result.data?.gt_result?.is_risk;

            if (bannedCheck) {
                response += `\n${gameName}: ${discordPing()} Auto check-in failed due to CAPTCHA blocking.`;
                retry = true;
                break;
            } else {
                response += `\n${gameName}: ${isError ? discordPing() : ""}${checkInResult}`;
            }
        }
        // If any request failed due to CAPTCHA, retry in an hour
        if (retry) {
            Utilities.sleep(3600000); // Sleep for 1 hour (3600 seconds * 1000 milliseconds)
            retry = false;
        }
    } while (retry);

    return response;
}

function postWebhook(data) {
    let payload = JSON.stringify({
        username: "Auto Check-In Notification",
        avatar_url: "https://i.imgur.com/ibrSmCn.png",
        content: data
    });

    const options = {
        method: "POST",
        contentType: "application/json",
        payload: payload,
        muteHttpExceptions: true
    };

    UrlFetchApp.fetch(discordWebhook, options);
}
