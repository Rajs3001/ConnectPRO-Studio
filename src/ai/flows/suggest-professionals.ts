'use server';
/**
 * @fileOverview An AI agent that suggests relevant professionals based on a conversation.
 *
 * - suggestProfessionals - A function that suggests professionals.
 * - SuggestProfessionalsInput - The input type for the suggestProfessionals function.
 * - SuggestProfessionalsOutput - The return type for the suggestProfessionals function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getProfessionals, Professional} from '@/services/professional';

const SuggestProfessionalsInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The history of the conversation with the user.'),
});
export type SuggestProfessionalsInput = z.infer<typeof SuggestProfessionalsInputSchema>;

const SuggestProfessionalsOutputSchema = z.object({
  suggestedProfessionals: z.array(
    z.object({
      id: z.string().describe('The ID of the suggested professional.'),
      name: z.string().describe('The name of the suggested professional.'),
      field: z.string().describe('The field of the suggested professional.'),
      description: z
        .string()
        .describe('A brief description of the suggested professional.'),
      skills: z.array(z.string()).describe('Skills of the professional'),
    })
  ).describe('The list of suggested professionals based on the conversation.'),
});
export type SuggestProfessionalsOutput = z.infer<typeof SuggestProfessionalsOutputSchema>;

export async function suggestProfessionals(input: SuggestProfessionalsInput): Promise<SuggestProfessionalsOutput> {
  return suggestProfessionalsFlow(input);
}

const suggestProfessionalsPrompt = ai.definePrompt({
  name: 'suggestProfessionalsPrompt',
  input: {
    schema: z.object({
      conversationHistory: z
        .string()
        .describe('The history of the conversation with the user.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedProfessionals: z.array(
        z.object({
          id: z.string().describe('The ID of the suggested professional.'),
          name: z.string().describe('The name of the suggested professional.'),
          field: z.string().describe('The field of the suggested professional.'),
          description: z
            .string()
            .describe('A brief description of the suggested professional.'),
          skills: z.array(z.string()).describe('Skills of the professional'),
        })
      ).describe('The list of suggested professionals based on the conversation.'),
    }),
  },
  prompt: `Based on the following conversation history, suggest professionals to connect with the user.

Conversation History: {{{conversationHistory}}}

Return the suggested professionals in the format specified by the output schema.`,
});

const suggestProfessionalsFlow = ai.defineFlow<
  typeof SuggestProfessionalsInputSchema,
  typeof SuggestProfessionalsOutputSchema
>({
  name: 'suggestProfessionalsFlow',
  inputSchema: SuggestProfessionalsInputSchema,
  outputSchema: SuggestProfessionalsOutputSchema,
},
async input => {
  const { output } = await suggestProfessionalsPrompt(input);
  return output!;
});
