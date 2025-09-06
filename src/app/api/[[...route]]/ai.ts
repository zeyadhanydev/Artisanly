import { Hono } from "hono";
import {z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { hf } from "@/lib/huggingface";
import { GoogleGenAI, Modality } from "@google/genai";
import axios from "axios";
import { verifyAuth } from "@hono/auth-js";
const app = new Hono()
  .post('/remove-bg',verifyAuth(), zValidator('json', z.object({
    image: z.string()
  })), async (c) => {
    const { image } = c.req.valid('json');
//https://zezohany2512--remove-bg-model-web-inference.modal.run
console.log(image)
 try {
   // Fetch the image from the provided URL
   const imageResponse = await fetch(image);
   if (!imageResponse.ok) {
     throw new Error('Failed to fetch image from URL');
   }

   // Get the image as binary data
   // const imageBlob = await imageResponse.blob();

   // Create a direct binary POST request to the Modal API endpoint
   // TODO later will send to server an image to remove bg and use huggingface model to remove bg
   // https://huggingface.co/briaai/RMBG-1.4
   const response = await fetch(`${process.env.REMOVE_BG_MODEL}?image=${image}`, {
     method: 'GET',
     headers: {
       'X-API-Key': process.env.API_KEY!,
     },

   });
  console.log(response)
  const arrayBuffer2 = await response.arrayBuffer();

  // Convert the binary data to a base64 string to display the image
  const base64 = btoa(
    new Uint8Array(arrayBuffer2).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );

  const img = `data:image/png;base64,${base64}`
  return c.json({
    data: img,
    clientSide: false
  });
} catch (err) {
  console.error('Error generating image:', err);
  // Fallback to client-side processing if server-side fails
  return c.json({
    error: 'Error processing image on server, try client-side processing',
    fallbackToClient: true,
    originalImage: image
  }, 500);
}
  })
  .post('/generate-image',
  // add verification
   verifyAuth(),
  zValidator('json',
    z.object({
    prompt: z.string(),
    model : z.enum(['google', 'huggingface', 'artisanly']).default('google').optional()
  })),
  async (c) => {
    const {prompt,model} = c.req.valid('json')
    console.log(model)
    if (model === 'artisanly') {
      console.log(process.env.GENERATE_IMAGE_MODAL_ENDPOINT,process.env.API_KEY)
        try {
          const response = await fetch(`${process.env.GENERATE_IMAGE_MODAL_ENDPOINT}?prompt=${encodeURIComponent(prompt)}`, {
            method: 'GET',
            headers: {
              'X-API-Key': process.env.API_KEY!,
              'Content-Type': 'application/json',
            },
          });
          console.log(response)
          const arrayBuffer = await response.arrayBuffer();

          // Convert the binary data to a base64 string to display the image
          const base64 = btoa(
            new Uint8Array(arrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );

          const img = `data:image/png;base64,${base64}`
          return c.json({
            data: img
          });
        } catch (err) {
          console.error('Error generating image:', err);
          return c.json({ error: 'Error generating image' }, 500);
        }
    }

    if (model === 'google') {
      try
    {

       const ai = new GoogleGenAI({
         // apiKey: process.env.GOOGLE_API_KEY!,
         // TODO: USER SHOULD ENABLE PAYMENT IN THE GOOGLD ACCOUNT IF HE WANT TO USE IT FOR FREE
         apiKey: 'AIzaSyAqPVcdaBwYK7Xf-QNGF9DHT93FFxxDXeQ',
         // vertexai: true
       });
         console.log(ai);
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            // config: {
            //   numberOfImages: 1
            // }
         });
        console.log((response.candidates[0].content));
        return c.json({
              data:response.candidates[0].content
            });
    }
    catch (error) {
      console.error('Error generating image:', error);
    }
      // let imgBytes;
      //   if (response.generatedImages) {
      //     for (const generatedImage of response.generatedImages) {
      //       imgBytes = generatedImage.image?.gcsUri;
      //       console.log(imgBytes);

      //       // const buffer = Buffer.from(imgBytes, "base64");
      //       // fs.writeFileSync(`imagen-${idx}.png`, buffer);
      //     }
      //   }

    }
    if (model === 'huggingface') {
      const response = await hf.textToImage({
        model: 'black-forest-labs/Flux.1-dev',
        // model: 'stabilityai/stable-diffusion-3.5-large',
        inputs: prompt,

      }, {
        outputType: 'url'
      })
      console.log(response)

      return c.json({
        data: response
      });
    }

  }

  );
export default app;
