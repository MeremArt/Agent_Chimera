import { IAgentRuntime, Memory, Provider, State } from "@ai16z/eliza";

const randomEmotionProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        const emotions = {
            happiness:
                _runtime.character.name +
                "The agent feels a surge of joy, a broad smile spreading across its face.",
            sadness:
                _runtime.character.name +
                "The agent looks downcast, its eyes filled with melancholy and a slow sigh escapes.",
            anger:
                _runtime.character.name +
                "The agent's face turns red with frustration, fists clenching in controlled rage.",
            fear: "The agent takes a step back, eyes wide with panic and heart pounding in its chest.",
            surprise:
                _runtime.character.name +
                "The agent's eyes widen and eyebrows lift in shock, a gasp of astonishment escapes.",
            disgust:
                _runtime.character.name +
                "The agent's face contorts into a grimace of repulsion, nose wrinkling in distaste.",
            curiosity:
                _runtime.character.name +
                "The agent tilts its head slightly, eyes narrowing with interest and wonder.",
            confusion:
                _runtime.character.name +
                "The agent scratches its head, furrowing its brow as it tries to make sense of things.",
            contentment:
                _runtime.character.name +
                "The agent reclines peacefully, a calm and serene expression on its face.",
            love:
                _runtime.character.name +
                "The agent's gaze softens, eyes filled with warmth and affection.",
        };

        // Randomly select one of the emotions

        const keys = Object.keys(emotions);
        const randomEmotion = keys[Math.floor(Math.random() * keys.length)];
        return emotions[randomEmotion];
    },
};
export { randomEmotionProvider };
