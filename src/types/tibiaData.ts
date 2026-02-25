export interface TibiaDataResponse {
    character: {
        character: TibiaCharacter;
    };
    information: {
        api: { version: number };
        timestamp: string;
    };
}

export interface TibiaCharacter {
    name: string;
    level: number;
    vocation: string;
    world: string;
    comment: string;
    guild?: { name: string; rank: string };
    last_login: string;
}
