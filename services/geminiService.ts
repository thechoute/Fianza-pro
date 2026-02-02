
import { GoogleGenAI } from "@google/genai";
import { Transaction, SavingsGoal, Commitment } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getFinancialAdvice = async (
  transactions: Transaction[],
  goals: SavingsGoal[],
  commitments: Commitment[]
): Promise<string> => {
  if (!API_KEY) return "Configura tu API Key para recibir consejos de IA.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const summary = transactions.reduce((acc, t) => {
      return t.type === 'INCOME' ? acc + t.amount : acc - t.amount;
    }, 0);

    const prompt = `
      Eres un asesor financiero experto. Analiza mi situación:
      - Saldo actual aproximado: $${summary}
      - Transacciones recientes: ${JSON.stringify(transactions.slice(0, 5))}
      - Metas de ahorro: ${JSON.stringify(goals)}
      - Gastos fijos mensuales (Compromisos): ${JSON.stringify(commitments)}
      
      Dame un consejo corto y accionable (máximo 3 frases) enfocado en cómo asegurar que cubra mis gastos fijos ($${commitments.reduce((a,b)=>a+b.amount, 0)}/mes) y alcance mis metas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No tengo consejos por ahora.";
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return "Lo siento, hubo un error al obtener consejos financieros.";
  }
};
