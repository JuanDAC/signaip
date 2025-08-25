

export interface Brand {
    id: string;
    name: string;   
    owner: string;
    lang: string;
    status: string;
}

export interface BrandCreate {
    name: string;
    owner: string;
    lang: string;
    status: string;
}

export interface BrandUpdate {
    name?: string;
    owner?: string;
    lang?: string;
    status?: string;
}
