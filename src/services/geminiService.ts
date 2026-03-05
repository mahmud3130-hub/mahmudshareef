import { GoogleGenAI, Type } from "@google/genai";
import { CVData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseCV(text: string): Promise<CVData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse the following CV text into a structured JSON format. 
    If information is missing, use reasonable placeholders or leave empty strings.
    
    CV Text:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          title: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          location: { type: Type.STRING },
          summary: { type: Type.STRING },
          experiences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                period: { type: Type.STRING },
                description: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["company", "role", "period", "description"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                school: { type: Type.STRING },
                degree: { type: Type.STRING },
                period: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["school", "degree", "period"]
            }
          },
          publications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                authors: { type: Type.STRING },
                title: { type: Type.STRING },
                journal: { type: Type.STRING },
                year: { type: Type.STRING },
                link: { type: Type.STRING },
                impactFactor: { type: Type.STRING }
              },
              required: ["authors", "title", "journal", "year"]
            }
          },
          workingPapers: { type: Type.ARRAY, items: { type: Type.STRING } },
          conferences: { type: Type.ARRAY, items: { type: Type.STRING } },
          leadership: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                period: { type: Type.STRING },
                organization: { type: Type.STRING },
                role: { type: Type.STRING }
              },
              required: ["period", "organization", "role"]
            }
          },
          eventCoordination: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                event: { type: Type.STRING },
                year: { type: Type.STRING }
              },
              required: ["role", "event", "year"]
            }
          },
          volunteering: { type: Type.ARRAY, items: { type: Type.STRING } },
          awards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                title: { type: Type.STRING },
                details: { type: Type.STRING }
              },
              required: ["year", "title", "details"]
            }
          },
          workshops: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                provider: { type: Type.STRING },
                year: { type: Type.STRING }
              },
              required: ["title", "provider", "year"]
            }
          },
          researchInterests: { type: Type.ARRAY, items: { type: Type.STRING } },
          skills: {
            type: Type.OBJECT,
            properties: {
              instrumental: { type: Type.ARRAY, items: { type: Type.STRING } },
              software: { type: Type.ARRAY, items: { type: Type.STRING } },
              office: { type: Type.ARRAY, items: { type: Type.STRING } },
              statistical: { type: Type.ARRAY, items: { type: Type.STRING } },
              graphics: { type: Type.ARRAY, items: { type: Type.STRING } },
              languages: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["instrumental", "software", "office", "statistical", "graphics", "languages"]
          },
          teaching: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                details: { type: Type.STRING }
              },
              required: ["role", "details"]
            }
          },
          profiles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["label", "url"]
            }
          },
          gallery: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                url: { type: Type.STRING },
                caption: { type: Type.STRING }
              },
              required: ["url", "caption"]
            }
          }
        },
        required: ["name", "title", "email", "summary", "experiences", "education", "skills", "publications", "awards", "researchInterests", "workingPapers", "conferences", "leadership", "eventCoordination", "volunteering", "workshops", "teaching", "profiles", "gallery"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as CVData;
  } catch (error) {
    console.error("Failed to parse CV JSON:", error);
    throw new Error("Could not parse CV data. Please try again with clearer text.");
  }
}
