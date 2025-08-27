# Vertex AI Setup Guide for Image Generation

This guide will help you set up Google Cloud Vertex AI for image generation in your application.

## Prerequisites

- A Google Cloud account
- Node.js application with the `@google/genai` package installed
- Basic knowledge of environment variables

## Step 1: Google Cloud Project Setup

### 1.1 Create or Select a Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your **Project ID** (not the project name)

### 1.2 Enable Required APIs

Navigate to the [API Library](https://console.cloud.google.com/apis/library) and enable:

- **Vertex AI API**
- **Cloud Storage API** (for image storage)
- **IAM Service Account Credentials API**

You can also enable these via gcloud CLI:
```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable iamcredentials.googleapis.com
```

## Step 2: Authentication Setup

### Option A: Service Account (Recommended for Production)

#### 2.1 Create a Service Account

1. Go to [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Fill in the details:
   - **Service account name**: `vertex-ai-image-generator`
   - **Description**: `Service account for Vertex AI image generation`
4. Click "Create and Continue"

#### 2.2 Assign Roles

Add the following roles to your service account:
- **Vertex AI User** (`roles/aiplatform.user`)
- **Storage Object Viewer** (`roles/storage.objectViewer`)
- **Storage Object Creator** (`roles/storage.objectCreator`)

#### 2.3 Create and Download Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Download the key file and store it securely
6. **Never commit this file to version control**

#### 2.4 Set Environment Variables

Add to your `.env.local` file:
```bash
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
```

### Option B: API Key (For Development Only)

#### 2.1 Create an API Key

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. **Restrict the API key** to only the APIs you need (Vertex AI API)

#### 2.2 Set Environment Variable

Add to your `.env.local` file:
```bash
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
GOOGLE_AI_API_KEY=your-api-key-here
```

## Step 3: Application Configuration

### 3.1 Install Dependencies

Ensure you have the required packages:
```bash
npm install @google/genai
```

### 3.2 Update Your Code

Here's an example of properly configured Vertex AI code:

```typescript
import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY!, // For API key auth
  project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
  vertexai: true // This enables Vertex AI
});

// Generate images
const response = await ai.models.generateImages({
  model: 'imagen-3.0-generate-002', // Latest Imagen model
  prompt: 'your image prompt here',
  config: {
    numberOfImages: 1,
    aspectRatio: '1:1', // Optional: square images
    safetyFilterLevel: 'BLOCK_SOME', // Optional: content filtering
    personGeneration: 'DONT_ALLOW' // Optional: avoid generating people
  }
});
```

## Step 4: Security Best Practices

### 4.1 Environment Variables

- Never hardcode API keys or project IDs in your source code
- Use environment variables for all sensitive configuration
- Add `.env.local` to your `.gitignore` file

### 4.2 Service Account Security

- Store service account keys securely
- Use the principle of least privilege (minimal required permissions)
- Rotate keys regularly
- Consider using Google Cloud's Application Default Credentials in production

### 4.3 API Key Security (if using)

- Restrict API keys to specific APIs
- Restrict API keys to specific IP addresses if possible
- Set usage quotas to prevent abuse
- Monitor API key usage regularly

## Step 5: Testing Your Setup

Create a simple test script to verify your setup:

```typescript
import { GoogleGenAI } from "@google/genai";

async function testVertexAI() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
      project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
      vertexai: true
    });

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: 'A simple test image of a blue sky',
      config: {
        numberOfImages: 1
      }
    });

    console.log('Success! Generated images:', response.generatedImages?.length);
    return response;
  } catch (error) {
    console.error('Vertex AI setup error:', error);
  }
}

testVertexAI();
```

## Step 6: Handling Images

Vertex AI returns images in different formats. Here's how to handle them:

```typescript
if (response.generatedImages) {
  for (const generatedImage of response.generatedImages) {
    if (generatedImage.image?.gcsUri) {
      // Image is stored in Google Cloud Storage
      console.log('Image URL:', generatedImage.image.gcsUri);
    } else if (generatedImage.image?.bytesBase64Encoded) {
      // Image is returned as base64
      const buffer = Buffer.from(generatedImage.image.bytesBase64Encoded, 'base64');
      // Save or process the buffer as needed
    }
  }
}
```

## Common Issues and Solutions

### Issue: "Project not found" error
**Solution**: Ensure your project ID is correct and the Vertex AI API is enabled.

### Issue: "Permission denied" error
**Solution**: Check that your service account has the correct roles assigned.

### Issue: "Authentication failed" error
**Solution**: Verify your service account key file path and ensure it's not corrupted.

### Issue: "Quota exceeded" error
**Solution**: Check your API quotas in the Google Cloud Console and request increases if needed.

## Production Deployment

For production environments:

1. Use service account authentication instead of API keys
2. Set up proper monitoring and logging
3. Implement rate limiting to prevent abuse
4. Use Google Cloud's Application Default Credentials when possible
5. Set up proper error handling and fallback mechanisms

## Cost Considerations

- Imagen 3.0 charges per generated image
- Monitor your usage in the Google Cloud Console
- Set up budget alerts to avoid unexpected charges
- Consider implementing usage limits in your application

## Support Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Imagen API Reference](https://cloud.google.com/vertex-ai/generative-ai/docs/image/generate-images)
- [Google GenAI SDK Documentation](https://github.com/google-gemini/generative-ai-js)
