import {
    Action,
    ActionExample,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    generateText,
} from "@ai16z/eliza";

// Define the Current News Action
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
        // Helper function to fetch news
        async function getCurrentnews(searchTerm: string) {
            try {
                const response = await fetch(
                    `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${process.env.NEWS_API_KEY}`
                );
                if (!response.ok)
                    throw new Error(`API error: ${response.statusText}`);
                const data = await response.json();
                return data.articles
                    .slice(0, 5)
                    .map(
                        (article) =>
                            `${article.title}\n${article.url}\n${article.content.slice(0, 500)}`
                    )
                    .join("\n\n");
            } catch (error) {
                console.error("Error fetching news:", error);
                return "Sorry, I couldn't fetch the news at the moment.";
            }
        }

        // Generate the search term from the user's message
        const context = `Extract the search term from the user's message. This message is ${_message.content.text} only respond with the search term do not include any other text`;

        const searchTerm = await generateText({
            runtime: _runtime,
            context,
            modelClass: ModelClass.SMALL,
            stop: ["/n"],
        });

        // Fetch news based on the search term
        const currentNews = await getCurrentnews(searchTerm);

        // Create a response
        const responseText = `The current news for the search term "${searchTerm}" is:\n\n${currentNews}`;

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

        await _runtime.messageManager.createMemory(newMemory);

        // Send response back
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
        // Add more examples as needed
    ] as ActionExample[][],
};
