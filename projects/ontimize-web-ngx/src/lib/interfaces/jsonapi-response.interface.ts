// Interface for describing errors
interface JSONAPIError {
  id?: string;                         // Unique identifier for this particular error occurrence
  status?: string;                     // HTTP status code applicable to this problem
  code?: string;                       // Application-specific error code
  title?: string;                      // Short, human-readable summary of the problem
  detail?: string;                     // Detailed explanation of the error
  source?: {
    pointer?: string;                  // JSON Pointer to the offending part of the document
    parameter?: string;
    header?: string                    // a string indicating the name of a single request header which caused the error
  };
  links?: {
    about?: string;                   // A link that leads to further details about this error
    type?: string;                    // Optional additional links
  };
  meta?: Record<string, any>;         // Optional additional information
}

type JsonApiLinkValue =
  | string                                // Simple URI string
  | JsonApiLinkObject                     // Full link object with metadata
  | null;

// Interface for links (can be extended as needed)
interface JSONAPILinks {

  [linkName: string]: JsonApiLinkValue;   // Dynamic keys: "self", "related", etc.
}

interface JsonApiLinkObject {
  href: string;                           // Required: The actual link URI
  meta?: Record<string, any>;             // Optional metadata about the link
  rel?: string;                           // Optional: Relation type (if not inferred)
  type?: string;                          // Optional: Media type of the resource
  title?: string;                         // Optional: Human-readable title
}

// Interface for resources
interface JSONAPIResource {
  type: string;                           // Resource type (e.g., "articles", "users")
  id: string;                             // Unique identifier of the resource
  attributes?: Record<string, any>;       // Attributes of the resource
  relationships?: Record<string, any>;    // Relationships with other resources (optional)
  links?: JSONAPILinks;                   // Links related to the resource (optional)
  meta?: Record<string, any>;             // Metadata (optional)
}

// Interface for successful responses
interface JSONAPISuccessfulResponse {
  data?: JSONAPIResource | JSONAPIResource[]; // Can be a single resource or a collection
  included?: JSONAPIResource[];               // Related resources (optional)
  meta?: Record<string, any>;                 // Metadata (optional)
  links?: JSONAPILinks;                       // Links (optional)
}

// Interface for error responses
interface JSONAPIErrorResponse {
  errors?: JSONAPIError[]; // A list of errors
}

// Generic interface that can be used for any API response, either successful or error
export interface JSONAPIResponse extends JSONAPISuccessfulResponse, JSONAPIErrorResponse { };
