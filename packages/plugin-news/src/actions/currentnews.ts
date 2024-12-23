import {
    ActionExample,
    Content,
    generateText,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    type Action,
} from "@ai16z/eliza";

export const currentNewsAction: Action = {
    name: "CurrentNews",
    similes: ["NEWS", "GET_NEWS", "GET_CURRENT_NEWS"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Get the current news for a search term if asked by the user",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        async function getCurrentnews(_searchTerm: string) {
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${process.env.NEWS_API_KEY}`
            );
            const data = await response.json();
            return data.articles
                .slice(0, 5)
                .map(
                    (article) =>
                        `${article.title}\n${article.url}\n${article.content.slice(0, 500)}`
                )
                .join("n\n");
        }

        // Create LangChain tools

        const context = `Extract the search term from the user's message. This message is ${_message.content.text} only respond with the search term do not include any other text`;

        const searchTerm = await generateText({
            runtime: _runtime,
            context,
            modelClass: ModelClass.SMALL,
            stop: ["/n"],
        });

        const currentNews = await getCurrentnews(searchTerm);

        const responseText =
            "The current news for the search term" +
            searchTerm +
            "is" +
            currentNews;

        const newMemory: Memory = {
            userId: _message.agentId,
            agentId: _message.agentId,
            roomId: _message.roomId,
            content: {
                text: responseText,
                action: "CURRENT_NEWS_RESPONSE",
                source: _message.content?.source,
            } as Content,
        };

        // const context = await composeContext({
        //     state: _state,
        //     template,
        // });
        await _runtime.messageManager.createMemory(newMemory);

        _callback(newMemory.content);

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "what's the latest crypto news?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me check the latest crypto news for you",
                    action: "GET_NEWS",
                },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "hey, can you update me on what's happening in crypto?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll fetch the latest crypto news",
                    action: "GET_NEWS",
                },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "whats going on with bitcoin today?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me get you the latest crypto updates",
                    action: "GET_NEWS",
                },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "got any news about cryptocurrency?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll check the current crypto news for you",
                    action: "GET_NEWS",
                },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "tell me about recent crypto developments" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure, I'll grab the latest crypto news",
                    action: "GET_NEWS",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
