export interface IAllRelationData {
    category: string;
    count: number;
    infoList: InfoList[]
}
export interface InfoList {
    id: string;
    relevanceId: number;
    relevanceName: {
        name: string;
        status: string;
    }
    relevanceType: string
}
