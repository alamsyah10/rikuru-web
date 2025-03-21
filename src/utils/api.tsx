// Candidate interface (for payload)
interface Candidate {
  no: number | string;
  id?: string | number;
  age?: number | string;
  birthday?: string | number;
  currentAffiliation?: string | number;
  japaneseLevel?: string | number;
  jlpt?: string | number;
  englishLevel?: string | number;
  schoolLocation?: string | number;
  schoolName?: string | number;
  faculty?: string | number;
  specialization?: string | number;
}

// Separate type for the payload structure
interface FileProcessingPayload {
  candidates: Candidate[];
  priorities: string[];
}

// Separate type for the API response
interface APIResponse {
  candidates: Candidate[];
  priorities: string[];
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Using NEXT_PUBLIC_ prefix for Next.js environment variables
export async function processCandidates(payload: FileProcessingPayload): Promise<APIResponse> {
  console.log("API_BASE_URL", API_BASE_URL);
  console.log("payload", payload);
  console.log("jsonify", JSON.stringify(payload));

  try {
    const response = await fetch(`${API_BASE_URL}/candidate-file-processor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: APIResponse = await response.json(); 

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

