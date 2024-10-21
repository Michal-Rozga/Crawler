export interface Score {
    type: string;
    home: string;
    away: string;
}

export interface Competitor {
    type: string;
    name: string;
}

export interface EventData {
    id: string;
    status: string;
    scores: {
        [key: string]: Score;
    };
    startTime: string;
    sport: string;
    competitors: {
        HOME: Competitor;
        AWAY: Competitor;
    };
    competition: string;
}

export interface MappingsData {
    mappings: Record<string, string>;
}