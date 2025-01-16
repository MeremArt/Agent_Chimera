import { Plugin } from "@ai16z/eliza";

import { currentNewsAction } from "./actions/currentnews.ts";

import { randomEmotionProvider } from "./providers/emotions.ts";
import { solanaToolsAction } from "./actions/solanaAction.ts";

export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

export const meremPlugin: Plugin = {
    name: "merem",
    description: "Agent bootstrap with basic actions and evaluators",
    actions: [currentNewsAction, solanaToolsAction],
    providers: [randomEmotionProvider],
};
