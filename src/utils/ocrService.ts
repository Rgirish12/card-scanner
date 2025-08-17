import axios from "axios";
import { Buffer } from "buffer";
import { ParsedDataType } from "src/types";

// Pass your Azure details here
const endpoint = process.env.EXPO_PUBLIC_ENDPOINT; // e.g., https://myocrresource.cognitiveservices.azure.com/
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

export async function extractBusinessCardInfo(base64Image: string) {
  try {
    // Convert base64 to binary
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Step 1: Submit document for analysis
    const submitResponse = await axios.post(
      `${endpoint}/formrecognizer/documentModels/prebuilt-businessCard:analyze?api-version=2023-07-31`,
      imageBuffer,
      {
        headers: {
          "Content-Type": "image/jpeg",
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      }
    );

    // Get poll URL from headers
    const operationLocation = submitResponse.headers["operation-location"];
    if (!operationLocation) {
      throw new Error("No operation-location returned from Azure.");
    }

    // Step 2: Poll until results are ready
    let analysisResult;
    for (let i = 0; i < 10; i++) {
      // Max 10 polls
      const pollResponse = await axios.get(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey },
      });

      if (pollResponse.data.status === "succeeded") {
        analysisResult = pollResponse.data;
        break;
      } else if (pollResponse.data.status === "failed") {
        throw new Error("Business card analysis failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 sec before retry
    }

    if (!analysisResult) {
      throw new Error("Timed out waiting for analysis results.");
    }

    const parsedData = parseBusinessCard(
      analysisResult.analyzeResult.documents
    );
    return parsedData;
  } catch (error) {
    console.error("Error extracting business card info:", error);
    throw error;
  }
}

export function parseBusinessCard(documents: any[]): ParsedDataType {
  if (!documents || documents.length === 0) {
    return { name: "", address: "", email: "", phone: "", companyName: "" };
  }
  console.log(documents);
  const fields = documents[0].fields || {};

  const name = fields.ContactNames?.valueArray?.[0]?.content?.trim() || "";

  const address = fields.Addresses?.valueArray?.[0]?.content?.trim() || "";

  const email = fields.Emails?.valueArray?.[0]?.content?.trim() || "";

  const phone =
    fields.WorkPhones?.valueArray?.[0]?.content?.trim() ||
    fields.MobilePhones?.valueArray?.[0]?.content?.trim() ||
    "";

  const companyName =
    fields.CompanyNames?.valueArray?.[0]?.content?.trim() || "";

  return {
    name,
    address,
    email,
    phone,
    companyName,
  };
}
