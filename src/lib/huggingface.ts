// import Replicate from 'replicate'
import { InferenceClient } from '@huggingface/inference'
export const hf = new  InferenceClient(process.env.HUGGINGFACE_API_TOKEN)
