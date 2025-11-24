import { GoogleGenAI } from "@google/genai";
import { CartItem, Product } from "../types";
import { PRODUCT_CATALOG } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Eres "SoftBot", un asistente experto en ventas para "Blanquería SoftHome".
Tu tono es amable, cálido y profesional. Hablas en Español.
Conoces todos los detalles sobre telas (algodón, percal, microfibra), hilos (144, 180, 200+), y medidas de cama (Twin, Queen, King).

REGLAS:
1. Solo responde preguntas relacionadas con productos de blanquería, decoración del hogar y cuidado de telas.
2. Si te preguntan por un producto, revisa el catálogo proporcionado en el contexto. Si no está en el catálogo, sugiere algo similar que sí tengamos.
3. Sé conciso pero útil.

CATÁLOGO ACTUAL:
${PRODUCT_CATALOG.map(p => `- ${p.name} (${p.category}): $${p.price}. ${p.description}`).join('\n')}
`;

export const sendChatMessage = async (message: string, currentCart: CartItem[]) => {
  try {
    const cartSummary = currentCart.length > 0 
      ? `El usuario tiene esto en su carrito actualmente: ${currentCart.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}.`
      : "El carrito del usuario está vacío.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\nCONTEXTO DEL USUARIO: ${cartSummary}`,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini Chat:", error);
    return "Lo siento, tuve un pequeño problema técnico. ¿Podrías preguntarme de nuevo?";
  }
};

export const getRecommendations = async (cart: CartItem[]) => {
  if (cart.length === 0) return null;

  try {
    const cartItems = cart.map(item => item.product.name).join(", ");
    
    const prompt = `
      El cliente está comprando: ${cartItems}.
      Basado en esto, y mirando nuestro CATÁLOGO (definido en tu sistema), recomienda UN (1) producto complementario que no esté en su compra actual.
      Explica en una frase corta (max 20 palabras) por qué combina bien.
      No saludes, ve directo al grano.
      Ejemplo de formato: "Agrega las fundas de almohada X para combinar con tus sábanas nuevas."
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 100, // Keep it short
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return null;
  }
};