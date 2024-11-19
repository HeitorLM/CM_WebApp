
export interface OccurrenceDB {
    occId?: number | null;
    locationId?: number | null;
    country: string;
    city?: string | null;
    reportRating: number;
    reliability: number;
    type: string;
    uuid: string;
    subtype: string;
    street?: string | null;
    id: string;
    nComments?: number | null;
    nThumbsUp?: number | null;
    reportBy?: string | null;
    confidence: number;
    wazeData: string;
    locLatitude?: number | null;
    locLongitude?: number | null;
    pubMillis: number;
}