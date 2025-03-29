import { generateSocialMediaContent } from './openai';
import { fileURLToPath } from 'url';

// Simple test function to verify OpenAI integration
async function testOpenAI() {
  console.log("Testing OpenAI integration...");
  try {
    const result = await generateSocialMediaContent(
      "TOBAIS is a digital agency specializing in web design, branding, and automation services for small businesses.",
      "twitter",
      "en"
    );
    
    console.log("OpenAI integration successful!");
    console.log("Generated content:", result.content);
    console.log("Generated hashtags:", result.hashtags);
    return true;
  } catch (error) {
    console.error("OpenAI integration test failed:", error);
    return false;
  }
}

// Get the current file URL 
const currentFileUrl = import.meta.url;

// Run the test when this file is directly executed
if (process.argv[1] === fileURLToPath(currentFileUrl)) {
  testOpenAI()
    .then(success => {
      if (success) {
        console.log("✅ OpenAI integration test passed");
        process.exit(0);
      } else {
        console.log("❌ OpenAI integration test failed");
        process.exit(1);
      }
    })
    .catch(err => {
      console.error("Test execution error:", err);
      process.exit(1);
    });
}

export { testOpenAI };