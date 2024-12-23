import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@ai16z/eliza";

export const helloWorld: Action = {
    name: "Hello_World",
    similes: ["HELLO"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Cool test.",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        const Hello_World = `hello world`;
        // const newState = await _runtime.updateRecentMessageState({
        //     ..._state,
        //     Hello_World,
        // });

        _callback({
            text: Hello_World,
        });

        // const newState = await _runtime.composeState(_message, {
        //     additionalData: Hello_World,
        // });

        // await _runtime.updateRecentMessageState(newState);

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you show me a Hello World in ascii",
                    action: "NONE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: ";",
                    action: "HELLO_WORLD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "can you show me a hello world? ",
                    action: "NONE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: ";",
                    action: "HELLO_WORLD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "display hello world ascii art ",
                    action: "NONE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: ";",
                    action: "HELLO_WORLD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What does Hello World look like in Java?",
                    action: "NONE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: ";",
                    action: "HELLO_WORLD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "How would you print Hello World ?",
                    action: "NONE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: ";",
                    action: "HELLO_WORLD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me Hello World in ascii art.",
                    action: "NONE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: ";",
                    action: "HELLO_WORLD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "How about a Hello World in Rust?",
                    action: "NONE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: ";",
                    action: "HELLO_WORLD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What about a Hello World in ascii art?",
                    action: "NONE",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: ";",
                    action: "HELLO_WORLD",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
