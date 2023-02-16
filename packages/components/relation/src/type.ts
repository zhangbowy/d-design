export interface IProps {
    visible: boolean;
    tabs: any[]
}


export interface ITableColumns {
    projectName: string;
    status: string
    projectId: number;
    ownerName: string;
    link: boolean;
}


export type Key = string | number;


export interface ITaskTableColumns {
    status: string
    link: boolean;
    id: number
}
