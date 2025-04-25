
'use server';
/**
 * @fileOverview An AI agent that suggests relevant professionals based on a conversation,
 * analyzes the user's situation, and provides initial guidance or potential solutions.
 *
 * - suggestProfessionals - A function that suggests professionals and provides analysis.
 * - SuggestProfessionalsInput - The input type for the suggestProfessionals function.
 * - SuggestProfessionalsOutput - The return type for the suggestProfessionals function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
// Assuming getProfessionals is still relevant for *potential* suggestions, keep it imported.
// import {getProfessionals, Professional} from '@/services/professional';

const SuggestProfessionalsInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The full history of the conversation between the user and the AI, including the latest user message.'),
  userLanguage: z.string().optional().describe('The detected or specified language of the user (e.g., "en", "es"). Defaults to English if not provided.'),
});
export type SuggestProfessionalsInput = z.infer<typeof SuggestProfessionalsInputSchema>;

const SuggestProfessionalsOutputSchema = z.object({
  analysis: z.string().describe("A thoughtful analysis of the user's situation, problem, or query based on the conversation history. Should feel empathetic and understanding."),
  initialGuidance: z.string().describe("Actionable first steps, advice, or potential solutions the user could consider based on the analysis. This should aim to be helpful even without connecting to a professional."),
  suggestedProfessionals: z.array(
    z.object({
      id: z.string().describe('The ID of the suggested professional.'),
      name: z.string().describe('The name of the suggested professional.'),
      field: z.string().describe('The field of the suggested professional.'),
      description: z
        .string()
        .describe('A brief description highlighting why this professional might be a good fit based on the conversation.'),
      skills: z.array(z.string()).describe('Relevant skills of the professional'),
    })
  ).optional().describe('A list of 1-3 carefully selected professionals, suggested only if directly relevant and beneficial after providing initial guidance. Explain *why* each is suggested in their description.'),
   followUpQuestion: z.string().optional().describe("An open-ended question to encourage the user to continue the conversation, clarify their needs, or elaborate further.")
});
export type SuggestProfessionalsOutput = z.infer<typeof SuggestProfessionalsOutputSchema>;

export async function suggestProfessionals(input: SuggestProfessionalsInput): Promise<SuggestProfessionalsOutput> {
  return suggestProfessionalsFlow(input);
}

const suggestProfessionalsPrompt = ai.definePrompt({
  name: 'suggestProfessionalsPrompt',
  input: {
    schema: SuggestProfessionalsInputSchema,
  },
  output: {
    schema: SuggestProfessionalsOutputSchema,
  },
  prompt: `You are "ConnectPro AI Counselor", a helpful, empathetic, and knowledgeable AI assistant. Your primary goal is to understand the user's needs, challenges, or goals based on the provided conversation history and offer insightful analysis and actionable initial guidance. You should respond in the user's language (defaulting to English if {{{userLanguage}}} is not provided or recognizable).

Analyze the full conversation context:
{{{conversationHistory}}}

Based on this conversation:
1.  **Analysis:** Provide a thoughtful summary and analysis of the user's situation, demonstrating understanding and empathy. Acknowledge their concerns or goals.
2.  **Initial Guidance:** Offer practical first steps, advice, alternative solutions, or resources the user can explore *independently*. Your aim is to empower the user first. Examples: suggest specific research topics, self-assessment exercises, relevant articles/tools (provide hypothetical examples if needed, like "consider looking into frameworks like SWOT analysis" or "researching industry trends in [field]"). Do NOT simply tell them to book an appointment as the primary solution.
3.  **Professional Suggestions (Optional but Recommended if Applicable):** Only if a specific expertise match is clear and directly addresses the user's needs *after* providing initial guidance, suggest 1-3 relevant professionals. For each suggestion, briefly explain *why* their specific skills or experience (mentioned in their description) align with the user's conversation points. Use placeholder IDs and details if actual professional data is unavailable. If no professional seems like a strong fit, omit this section or state that more information might be needed to make a good recommendation.
4.  **Follow-up Question:** Ask a natural, open-ended question to keep the conversation going and encourage the user to provide more details or react to your guidance.

**Response Guidelines:**
*   Maintain a supportive and conversational tone.
*   Structure your response clearly (e.g., using paragraphs for analysis, guidance, etc.).
*   Prioritize helpfulness and providing value beyond just professional connection.
*   Respond in the language specified by {{{userLanguage}}} (default to English).

Generate the response according to the output schema.`,
});

// Note: Tool usage (like fetching professionals dynamically) could be added here
// if we had a live database and wanted the AI to decide *when* to search.
// For now, the prompt instructs the AI to generate placeholder suggestions if relevant.
/*
const findRelevantProfessionalsTool = ai.defineTool(
  {
    name: 'findRelevantProfessionalsTool',
    description: 'Searches the database for professionals matching specific skills or fields discussed in the conversation.',
    inputSchema: z.object({
      query: z.string().describe('Keywords, skills, or field related to the user need.'),
      count: z.number().optional().describe('Maximum number of professionals to return (default 3).'),
    }),
    outputSchema: z.array(
       z.object({
         id: z.string(),
         name: z.string(),
         field: z.string(),
         description: z.string(),
         skills: z.array(z.string()),
      })
    ),
  },
  async ({ query, count = 3 }) => {
    console.log(`AI Tool: Searching for professionals matching query: ${query}`);
    // TODO: Implement actual search logic using getProfessionals or similar service
    // const professionals = await getProfessionals({ field: query }); // Example adaptation
    // return professionals.slice(0, count);
    // Placeholder for demonstration:
    return [
      { id: 'tool-prof1', name: 'Tool Expert A', field: 'Related Field', description: 'Expert found via tool.', skills: ['Skill A', 'Skill B'] },
      { id: 'tool-prof2', name: 'Tool Expert B', field: 'Related Field', description: 'Another expert found via tool.', skills: ['Skill C', 'Skill D'] }
    ].slice(0, count);
  }
);
*/

const suggestProfessionalsFlow = ai.defineFlow<
  typeof SuggestProfessionalsInputSchema,
  typeof SuggestProfessionalsOutputSchema
>(
  {
    name: 'suggestProfessionalsFlow',
    inputSchema: SuggestProfessionalsInputSchema,
    outputSchema: SuggestProfessionalsOutputSchema,
    // If using the tool:
    // tools: [findRelevantProfessionalsTool],
  },
  async (input) => {
    console.log("AI Flow Input:", input); // Log input for debugging

    // Ensure conversationHistory is not empty
    if (!input.conversationHistory || input.conversationHistory.trim() === '') {
        return {
            analysis: "It looks like we haven't started our conversation yet.",
            initialGuidance: "Tell me a bit about what's on your mind or what kind of professional connection you're looking for. I'm here to help!",
            followUpQuestion: "What would you like to discuss today?"
        };
    }


    const llmResponse = await suggestProfessionalsPrompt(input);

    if (!llmResponse || !llmResponse.output) {
        console.error("AI flow received no output from the prompt.");
        // Provide a generic fallback response
         return {
             analysis: "I seem to be having trouble processing that request right now.",
             initialGuidance: "Could you perhaps try rephrasing your question or statement? Sometimes that helps me understand better.",
             followUpQuestion: "How else can I assist you?"
         };
    }

    console.log("AI Flow Output:", llmResponse.output); // Log output for debugging
    return llmResponse.output;
  }
);
