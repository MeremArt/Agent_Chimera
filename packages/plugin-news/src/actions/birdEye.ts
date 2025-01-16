import {
    ActionExample,
    composeContext,
    Content,
    generateText,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    type Action,
} from "@ai16z/eliza";
import { SolanaAgentKit } from "solana-agent-kit";

const TOKEN_ADDRESSES = {
    SOL: "So11111111111111111111111111111111111111112",
    USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    WISE: "YOUR_WISE_TOKEN_ADDRESS_HERE",
    JTO: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
} as const;

// Create LangChain tools

export const birdeyeTokenAction: Action = {
    name: "BirdeyeToken",
    similes: [
        "GET_TOKEN_PRICE",
        "BIRDEYE_GET_TOKEN_PRICE",
        "CHECK_TOKEN_PRICE",
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "Get the current token price from Birdeye API if asked by the user",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        const agent = new SolanaAgentKit(
            "mainnet-beta",
            undefined,
            "confirmed"
        );

        // Create LangChain tools

        async function getBirdeyeToken(tokenAddress: string) {
            try {
                const response = await fetch(
                    `https://public-api.birdeye.so/public/price?address=${tokenAddress}`,
                    {
                        headers: {
                            "X-API-KEY": `${process.env.BIRDEYE_API_KEY}`,
                            Accept: "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return {
                    value: data.data.value,
                    updateUnixTime: data.data.updateUnixTime,
                    changePercentage24h: data.data.priceChange24h,
                    volume24h: data.data.volume24h,
                    agent,
                };
            } catch (error) {
                console.error("Error fetching token price:", error);
                throw new Error("Failed to fetch token price from Birdeye");
            }
        }

        const context = `Extract the token symbol from the user's message. Valid tokens are: SOL, USDC, BONK, WISE, JTO. This message is: ${_message.content.text}. Only respond with the token symbol in uppercase. Do not include any other text.`;

        const tokenSymbol = await generateText({
            runtime: _runtime,
            context,
            modelClass: ModelClass.SMALL,
            stop: ["\n"],
        });

        if (!tokenSymbol) {
            throw new Error("No token symbol found");
        }

        const tokenAddress =
            TOKEN_ADDRESSES[tokenSymbol as keyof typeof TOKEN_ADDRESSES];
        if (!tokenAddress) {
            throw new Error("Invalid token symbol");
        }

        const priceData = await getBirdeyeToken(tokenAddress);

        const responseText = `Current price of ${tokenSymbol}: $${priceData.value}\n24h change: ${priceData.changePercentage24h}%\nVolume 24h: $${priceData.volume24h}`;

        const newMemory: Memory = {
            userId: _message.agentId,
            agentId: _message.agentId,
            roomId: _message.roomId,
            content: {
                text: responseText,
                action: "BIRDEYE_TOKEN_PRICE_RESPONSE",
                source: _message.content?.source,
            } as Content,
        };

        await _runtime.messageManager.createMemory(newMemory);

        _callback(newMemory.content);

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "what's the current SOL price?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me check the SOL price for you",
                    action: "GET_TOKEN_PRICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "how much is BONK worth?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Fetching current BONK price",
                    action: "GET_TOKEN_PRICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "check USDC price" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Getting USDC price data",
                    action: "GET_TOKEN_PRICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "what's the price of WISE token?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Checking WISE token price",
                    action: "GET_TOKEN_PRICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "show me JTO price" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Fetching JTO price data",
                    action: "GET_TOKEN_PRICE",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
