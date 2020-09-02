import { Glue42 } from "@glue42/desktop";
export const CHANNELS_DATA_DIV = "channel-data-div";

export function subscribeChannels(glue: Glue42.Glue) {
    glue.channels.subscribe((data) => {
        const div = document.getElementById(CHANNELS_DATA_DIV);
        div.innerText = JSON.stringify(data);
    });
}

export async function updateChannel(glue: Glue42.Glue) {
    await glue.channels.publish({time: new Date().getTime()});
}