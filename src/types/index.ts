
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
export interface LocationDB {
    locationId: number;
    userId: number;
    uuid: string;
    name: string;
    latitude: number;
    longitude: number;
    bottom: number;
    left: number;
    right: number;
    top: number;
    isMuted: boolean;
    timeStamp: string;
}

export interface UsersEntity {
    fleet: string;
    magvar: number;
    inscale: boolean;
    mood: number;
    addon: number;
    ping: number;
    location: LocationOrLineEntity;
    id: string;
    userName: string;
    speed: number;
    ingroup: boolean;
}

export interface LocationOrLineEntity {
    x: number;
    y: number;
}

export interface UsersEntity {
    fleet: string;
    magvar: number;
    inscale: boolean;
    mood: number;
    addon: number;
    ping: number;
    location: LocationOrLineEntity;
    id: string;
    userName: string;
    speed: number;
    ingroup: boolean;
}