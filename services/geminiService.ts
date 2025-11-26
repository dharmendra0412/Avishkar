import { GoogleGenAI, Type } from "@google/genai";
import { Language, AgriDashboardData, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for fast, low-latency text responses (Good for low bandwidth areas)
const TEXT_MODEL = "gemini-2.5-flash";

const getLanguageName = (lang: Language) => {
    switch(lang) {
        case 'hi': return 'Hindi';
        case 'mr': return 'Marathi';
        default: return 'English';
    }
}

export const simplifyGovernmentScheme = async (schemeText: string, lang: Language = 'en') => {
  const languageName = getLanguageName(lang);
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `You are a helpful assistant for rural communities. Explain the following government scheme in very simple, easy-to-understand language in ${languageName}. Focus on: 1. What is it? 2. Who is it for? 3. How to apply? Keep it under 150 words. \n\n Scheme Text: ${schemeText}`,
      config: {
        systemInstruction: "You are a digital literacy expert helping people with limited tech skills.",
      }
    });
    return response.text || "I could not simplify this text right now.";
  } catch (error) {
    console.error("Error simplifying text:", error);
    return "An error occurred while connecting to the digital assistant.";
  }
};

export const generateDigitalLiteracyTip = async (topic: string, lang: Language = 'en') => {
  const languageName = getLanguageName(lang);
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `Create a very short, step-by-step guide (max 3 steps) for a rural user on how to: ${topic}. Write the response in ${languageName}. Use emojis to make it friendly.`,
    });
    return response.text || "No tips available.";
  } catch (error) {
    console.error("Error generating tip:", error);
    return "Could not load tip.";
  }
};

export const getDailyDigitalTip = async (lang: Language = 'en') => {
    const languageName = getLanguageName(lang);
    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: `Give me one random, very simple "Daily Digital Safety Tip" for a new internet user in a village. (e.g., about OTP privacy, fake calls, or strong passwords). 
            Write it in ${languageName}. Keep it one sentence only.`,
        });
        return response.text;
    } catch (e) {
        return "Keep your OTP safe!";
    }
}

export const generateQuiz = async (topic: string, lang: Language = 'en') => {
    const languageName = getLanguageName(lang);
    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: `Create a simple 3-question quiz about "${topic}" for a beginner rural user. 
            The language must be ${languageName}.
            Return a JSON array of objects.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            correctAnswer: { 
                                type: Type.INTEGER, 
                                description: "The 0-based index of the correct option in the options array."
                            }
                        },
                        required: ["question", "options", "correctAnswer"]
                    }
                }
            }
        });
        
        // Ensure we parse the text properly even if the model wraps it in markdown blocks
        const cleanJson = response.text?.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson || "[]");
    } catch (e) {
        console.error("Quiz generation failed", e);
        return [];
    }
}

export const getSchemeRecommendations = async (userProfile: string, lang: Language = 'en') => {
    const languageName = getLanguageName(lang);
    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: `Based on this user profile: "${userProfile}", provide:
            1. 'recommendations': 3 highly relevant government schemes or digital services.
            2. 'related': 2 other schemes that might be useful but are less direct or related.
            
            Provide 'name', 'benefit', 'action', and 'link' (The official website URL for the scheme, or a highly relevant portal link) for all schemes.
            Language: ${languageName}.
            Return JSON.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    benefit: { type: Type.STRING },
                                    action: { type: Type.STRING },
                                    link: { type: Type.STRING, description: "Official website URL" }
                                },
                                required: ["name", "benefit", "action", "link"]
                            }
                        },
                        related: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    benefit: { type: Type.STRING },
                                    action: { type: Type.STRING },
                                    link: { type: Type.STRING, description: "Official website URL" }
                                },
                                required: ["name", "benefit", "action", "link"]
                            }
                        }
                    }
                }
            }
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return "{}";
    }
}

export const analyzeCropImage = async (base64Image: string, mimeType: string, lang: Language = 'en') => {
    const languageName = getLanguageName(lang);
    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL, // Flash supports multimodal input
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Image
                        }
                    },
                    {
                        text: `You are an expert agriculturalist (Kisan Doctor). Analyze this image of a plant/crop. 
                        1. Identify the crop.
                        2. Identify if there is any disease or pest.
                        3. If healthy, say "Healthy".
                        4. If diseased, provide a simple home remedy or chemical treatment.
                        
                        Provide the response in ${languageName}. Format with clear headings.`
                    }
                ]
            }
        });
        return response.text;
    } catch (e) {
        console.error("Crop analysis failed", e);
        return "Could not analyze the image. Please try again.";
    }
}

export const getFarmingAdvice = async (query: string, lang: Language = 'en') => {
    const languageName = getLanguageName(lang);
    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: `You are a smart farming advisor. Answer this question for an Indian farmer: "${query}". 
            Provide practical advice regarding market prices (general trends), weather impact, or farming techniques.
            Answer in ${languageName}. Keep it short and actionable.`,
        });
        return response.text;
    } catch (e) {
        return "Service unavailable.";
    }
}

export const getAgriDashboardData = async (location: string, lang: Language = 'en'): Promise<AgriDashboardData | null> => {
    const languageName = getLanguageName(lang);
    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: `For the location "${location}" in India, generate a mock farming dashboard data JSON in ${languageName}.
            1. Weather: Realistic current temperature, condition (Sunny/Rainy), humidity, and a 1-sentence farming advice based on weather.
            2. Forecast: A 3-day weather forecast with day name, date, icon, high/low temps, rain probability, and condition.
            3. Prices: 3-4 common crops in that region with realistic market prices (₹/quintal) and trend (up/down/stable).
            
            Return JSON only.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        weather: {
                            type: Type.OBJECT,
                            properties: {
                                temp: { type: Type.STRING },
                                condition: { type: Type.STRING },
                                icon: { type: Type.STRING, description: "Single emoji for weather" },
                                humidity: { type: Type.STRING },
                                advice: { type: Type.STRING }
                            },
                            required: ["temp", "condition", "icon", "humidity", "advice"]
                        },
                        forecast: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING, description: "Day name e.g. Mon" },
                                    date: { type: Type.STRING, description: "Date e.g. 24 Oct" },
                                    icon: { type: Type.STRING, description: "Emoji" },
                                    tempHigh: { type: Type.STRING },
                                    tempLow: { type: Type.STRING },
                                    rainProb: { type: Type.STRING, description: "Percentage e.g. 20%" },
                                    condition: { type: Type.STRING }
                                },
                                required: ["day", "date", "icon", "tempHigh", "tempLow", "rainProb", "condition"]
                            }
                        },
                        prices: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    crop: { type: Type.STRING },
                                    price: { type: Type.STRING },
                                    change: { type: Type.STRING, description: "One of: up, down, stable" }
                                },
                                required: ["crop", "price", "change"]
                            }
                        }
                    },
                    required: ["weather", "forecast", "prices"]
                }
            }
        });
        const cleanJson = response.text?.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson || "null");
    } catch (e) {
        console.error("Agri dashboard failed", e);
        return null;
    }
}

export const getHealthAdvice = async (symptoms: string, lang: Language = 'en') => {
    const languageName = getLanguageName(lang);
    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: `You are a helpful and responsible rural medical assistant. A user is asking for advice for these symptoms: "${symptoms}".
            
            Instructions:
            1. Always start with a strict disclaimer: "I am an AI, not a doctor. If the condition is serious, go to the primary health center (PHC) immediately."
            2. Provide 2-3 simple, effective home remedies or first-aid steps.
            3. Advise what NOT to do.
            4. Suggest when to see a doctor immediately.
            
            Output Language: ${languageName}.
            Format: Use bullet points and simple language.`,
            config: {
                systemInstruction: "You are a digital health guide. Be cautious, helpful, and clear.",
            }
        });
        return response.text;
    } catch (e) {
        console.error("Health advice failed", e);
        return "Service unavailable. Please visit a doctor.";
    }
}

export const getChatResponse = async (chatHistory: Message[], newMessage: string, lang: Language = 'en') => {
    const languageName = getLanguageName(lang);
    try {
        // Create a new instance for chat to ensure session isolation if needed, though single instance is fine too.
        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview',
            config: {
                systemInstruction: `You are a helpful and knowledgeable assistant for GramSetu, a platform empowering rural India. 
                Answer questions about government schemes, agriculture, digital literacy, and local issues.
                Answer in ${languageName}. 
                Be polite, concise, and use simple language suitable for rural users.
                If the query is technical (e.g., farming), give practical advice.`,
            },
            history: chatHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        return result.text;
    } catch (e) {
        console.error("Chat Error", e);
        return "Sorry, I am unable to connect right now. Please try again.";
    }
}