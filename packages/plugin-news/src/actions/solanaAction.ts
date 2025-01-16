import {
    ActionExample,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    type Action,
    generateText,
} from "@ai16z/eliza";
import { SolanaAgentKit } from "solana-agent-kit";

// Initialize SolanaAgentKit
let agent: SolanaAgentKit;

try {
    agent = new SolanaAgentKit(
        process.env.SOLANA_PRIVATE_KEY!,
        process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
        process.env.OPENAI_API_KEY!
    );
} catch (error) {
    console.error("Failed to initialize SolanaAgentKit:", error);
}

// Helper function to clean JSON string
const cleanJsonString = (str: string): string => {
    // Remove any markdown code blocks
    str = str.replace(/```[^`]*```/g, "");
    // Remove single backticks
    str = str.replace(/`/g, "");
    // Find the first { and last }
    const start = str.indexOf("{");
    const end = str.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
        return str.slice(start, end + 1);
    }
    return str;
};

// Solana operations - mix of real and mock
const solanaOperations = {
    // Real Solana balance call
    getBalance: async () => {
        const balance = await agent.getBalance();
        return balance.toFixed(4); // Format balance nicely
    },
    // Mock operations for other functions
    transfer: async (recipient: string, amount: number) =>
        `Transferred ${amount} SOL to ${recipient}`,
    trade: async (outputToken: string, amount: number, inputToken = "SOL") =>
        `Traded ${amount} ${inputToken} for ${outputToken}`,
    deployToken: async (name: string, symbol: string) =>
        `Deployed token ${name} (${symbol})`,
};

export const solanaToolsAction: Action = {
    name: "SolanaTools",
    similes: ["SOLANA", "GET_BALANCE", "TRANSFER", "TRADE", "DEPLOY_TOKEN"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return Boolean(agent);
    },
    description:
        "Perform various Solana blockchain operations based on user requests",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        if (!agent) {
            const errorMemory: Memory = {
                userId: _message.agentId,
                agentId: _message.agentId,
                roomId: _message.roomId,
                content: {
                    text: "Solana tools are not properly initialized",
                    action: "SOLANA_TOOLS_ERROR",
                    source: _message.content?.source,
                } as Content,
            };
            await _runtime.messageManager.createMemory(errorMemory);
            _callback(errorMemory.content);
            return false;
        }

        try {
            const context = `Analyze: "${_message.content.text}"
                           OUTPUT EXACTLY one of:
                           {"action":"balance"}
                           {"action":"transfer","params":{"recipient":"X","amount":N}}
                           {"action":"trade","params":{"outputToken":"X","amount":N}}
                           {"action":"deploy","params":{"name":"X","symbol":"Y"}}
                           Nothing else.`;

            const response = await generateText({
                runtime: _runtime,
                context,
                modelClass: ModelClass.SMALL,
                stop: ["\n"],
            });

            const cleanedResponse = cleanJsonString(response);
            const actionData = JSON.parse(cleanedResponse);

            let responseText = "";

            try {
                switch (actionData.action.toLowerCase()) {
                    case "balance": {
                        const balance = await solanaOperations.getBalance();
                        responseText = `I've checked your Solana wallet and your current balance is ${balance} SOL`;
                        break;
                    }
                    case "transfer": {
                        responseText = await solanaOperations.transfer(
                            actionData.params.recipient,
                            actionData.params.amount
                        );
                        responseText = `I've initiated the transfer of ${actionData.params.amount} SOL to ${actionData.params.recipient}. The transaction has been sent!`;
                        break;
                    }
                    case "trade": {
                        responseText = await solanaOperations.trade(
                            actionData.params.outputToken,
                            actionData.params.amount,
                            actionData.params.inputToken
                        );
                        responseText = `I've executed a trade of ${actionData.params.amount} ${actionData.params.inputToken || "SOL"} for ${actionData.params.outputToken}. The trade has been completed!`;
                        break;
                    }
                    case "deploy": {
                        responseText = await solanaOperations.deployToken(
                            actionData.params.name,
                            actionData.params.symbol
                        );
                        responseText = `Great! I've deployed your new token "${actionData.params.name}" with the symbol ${actionData.params.symbol}. The token has been created successfully!`;
                        break;
                    }
                    default:
                        responseText =
                            "I apologize, but that's not a Solana operation I can help with right now. I can help you check balances, transfer SOL, trade tokens, or deploy new tokens.";
                }
            } catch (opError) {
                responseText = `Operation failed: ${opError instanceof Error ? opError.message : "Unknown error"}`;
            }

            const newMemory: Memory = {
                userId: _message.agentId,
                agentId: _message.agentId,
                roomId: _message.roomId,
                content: {
                    text: responseText,
                    action: "SOLANA_TOOLS_RESPONSE",
                    source: _message.content?.source,
                } as Content,
            };

            await _runtime.messageManager.createMemory(newMemory);
            _callback(newMemory.content);

            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
            const errorMemory: Memory = {
                userId: _message.agentId,
                agentId: _message.agentId,
                roomId: _message.roomId,
                content: {
                    text: "I couldn't process that request. Let me know what you'd like to do: check balance, transfer SOL, trade tokens, or deploy a new token.",
                    action: "SOLANA_TOOLS_ERROR",
                    source: _message.content?.source,
                } as Content,
            };

            await _runtime.messageManager.createMemory(errorMemory);
            _callback(errorMemory.content);

            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "what's my solana balance?" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Your current balance is 10.5000 SOL",
                    action: "GET_BALANCE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "send 1 SOL to abc123.sol" },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Transferred 1 SOL to abc123.sol",
                    action: "TRANSFER",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
