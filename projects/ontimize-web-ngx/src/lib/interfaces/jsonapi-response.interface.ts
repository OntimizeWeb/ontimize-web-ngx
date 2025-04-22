import { ServiceResponse } from "./service-response.interface";


// Interface for describing errors
interface JSONAPIError {
  status: string;        // HTTP status code of the error
  source?: {             // Indicates the part of the resource that caused the error (optional)
    pointer: string;     // Pointer to the part of the resource (e.g., "/data/attributes/title")
  };
  title: string;         // Short title for the error
  detail: string;        // Detailed description of the error
}

// Interface for links (can be extended as needed)
interface JSONAPILinks {
  self: string;          // URL of the current resource
  [key: string]: string; // Additional custom links (e.g., "next", "prev", etc.)
}

// Interface for resources
interface JSONAPIResource {
  type: string;          // Resource type (e.g., "articles", "users")
  id: string;            // Unique identifier of the resource
  attributes: Record<string, any>;  // Attributes of the resource
  relationships?: Record<string, any>;  // Relationships with other resources (optional)
  links?: JSONAPILinks;  // Links related to the resource (optional)
}

// Interface for successful responses
interface JSONAPISuccessfulResponse {
  data?: JSONAPIResource | JSONAPIResource[]; // Can be a single resource or a collection
  included?: JSONAPIResource[];  // Related resources (optional)
  meta?: Record<string, any>;   // Metadata (optional)
  links?: JSONAPILinks;         // Links (optional)
}

// Interface for error responses
interface JSONAPIErrorResponse {
  errors?: JSONAPIError[]; // A list of errors
}

// Generic interface that can be used for any API response, either successful or error
export interface JSONAPIResponse extends JSONAPISuccessfulResponse, JSONAPIErrorResponse { };
