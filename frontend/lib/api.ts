const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

export type BackendCollege = {
  id?: string;
  college_name?: string;
  city?: string;
  state?: string;
  type?: string;
  linguistic_minority?: boolean;
  facilities?: string[];
  roi?: {
    roi_score?: number;
    payback_years?: number;
  };
  courses?: Array<{
    course_id?: string;
    degree?: string;
    branch?: string;
    fees?: {
      total_fees?: number;
    };
    placements?: {
      placement_percentage?: number;
      avg_package?: number;
      top_companies?: string[];
    };
  }>;
};

export type PredictorCollege = {
  college: string;
  city?: string | null;
  degree: string;
  branch: string;
  category: string;
  confidence: number;
  reason: string;
  cutoff: number;
  your_input: number;
  avg_package?: number | null;
  fees?: number | null;
  roi: number;
  risk: string;
  placement_percentage?: number | null;
  top_companies?: string[] | null;
  explanation?: string | null;
};

export type PredictorResponse = {
  input_type: string;
  rank?: number | null;
  percentile?: number | null;
  category: string;
  selected_course: string;
  total_results: number;
  summary: string;
  results: Record<string, PredictorCollege[]>;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function fetchColleges() {
  return request<{ total: number; colleges: BackendCollege[] }>("/colleges");
}

export async function fetchPredictor(params: {
  percentile?: number;
  rank?: number;
  category: string;
  course: string;
}) {
  const searchParams = new URLSearchParams();

  if (typeof params.percentile === "number") {
    searchParams.set("percentile", String(params.percentile));
  }

  if (typeof params.rank === "number") {
    searchParams.set("rank", String(params.rank));
  }

  searchParams.set("category", params.category);
  searchParams.set("course", params.course);

  return request<PredictorResponse>(`/predictor/?${searchParams.toString()}`);
}

export async function generatePersonalization(payload: {
  rank: number;
  interests: string[];
  preferred_course: string;
}) {
  return request<{
    personalized_report?:
      | string
      | {
          career_target?: string;
          roadmap?: string[];
          college_decision?: string;
          roi_strategy?: string;
          travel_strategy?: string;
          goal_strategy?: string;
          final_advice?: string;
        };
    ai_mentor_advice?: string;
    college_considered?: Record<string, BackendCollege[]>;
    error?: string;
  }>("/personalization/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function sendChatMessage(message: string) {
  return request<{ response: string }>("/chatbot/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
