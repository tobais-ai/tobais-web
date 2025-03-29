import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-key-will-be-provided" 
});

// Generate social media content based on business info
export async function generateSocialMediaContent(
  prompt: string,
  platform: string,
  language: string
): Promise<{ content: string, hashtags: string[] }> {
  try {
    const systemPrompt = `You are an expert social media content creator. 
    Create engaging, professional content for ${platform} in ${language} language.
    Consider platform-specific best practices and character limits.
    Return your response as JSON with 'content' and 'hashtags' fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      content: result.content || "",
      hashtags: result.hashtags || []
    };
  } catch (error: any) {
    console.error("OpenAI error:", error.message);
    throw new Error(`Failed to generate social media content: ${error.message}`);
  }
}

// Generate content for multiple platforms at once
export async function generateMultiPlatformContent(
  prompt: string,
  platforms: string[],
  language: string
): Promise<Record<string, { content: string, hashtags: string[] }>> {
  try {
    const systemPrompt = `You are an expert social media content creator.
    Create engaging, professional content for multiple platforms in ${language} language.
    Consider each platform's best practices, character limits, and format requirements.
    Return your response as JSON with each platform as a key, and 'content' and 'hashtags' fields for each platform.`;

    const userPrompt = `Create content for the following platforms: ${platforms.join(", ")}.
    
    Business information: ${prompt}
    
    Format your response as JSON like this:
    {
      "platform1": {
        "content": "The content for platform1",
        "hashtags": ["hashtag1", "hashtag2"]
      },
      "platform2": {
        "content": "The content for platform2",
        "hashtags": ["hashtag1", "hashtag2"]
      }
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const result = JSON.parse(response.choices[0].message.content);
    
    // Ensure we have all requested platforms
    const output: Record<string, { content: string, hashtags: string[] }> = {};
    for (const platform of platforms) {
      if (result[platform]) {
        output[platform] = {
          content: result[platform].content || "",
          hashtags: result[platform].hashtags || []
        };
      } else {
        // Fallback if platform is missing in the response
        output[platform] = {
          content: "",
          hashtags: []
        };
      }
    }
    
    return output;
  } catch (error: any) {
    console.error("OpenAI error:", error.message);
    throw new Error(`Failed to generate multi-platform content: ${error.message}`);
  }
}

// Generate content recommendations based on target audience
export async function generateContentRecommendations(
  audience: string,
  industry: string,
  language: string
): Promise<{ topics: string[], contentTypes: string[], platforms: string[] }> {
  try {
    const systemPrompt = `You are an expert digital marketing strategist.
    Create content recommendations for a business based on their target audience and industry.
    Return your response as JSON with 'topics', 'contentTypes', and 'platforms' arrays.`;

    const userPrompt = `Generate content recommendations for a business with the following:
    
    Target audience: ${audience}
    Industry: ${industry}
    Language: ${language}
    
    Format your response as JSON like this:
    {
      "topics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
      "contentTypes": ["contentType1", "contentType2", "contentType3"],
      "platforms": ["platform1", "platform2", "platform3"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error("OpenAI error:", error.message);
    throw new Error(`Failed to generate content recommendations: ${error.message}`);
  }
}
