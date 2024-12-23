import { Plugin } from "@ai16z/eliza";

import { noneAction } from "./actions/none.ts";

import { factEvaluator } from "./evaluators/fact.ts";

import { factsProvider } from "./providers/facts.ts";
import { timeProvider } from "./providers/time.ts";

export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

export const testPlugin: Plugin = {
    name: "test",
    description: "test the plug",
    actions: [noneAction],
    evaluators: [factEvaluator],
    providers: [timeProvider, factsProvider],
};
