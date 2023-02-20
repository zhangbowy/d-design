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

export type OperationType = 'OKR' | 'TASK' | 'PROJECT'
export type RelevanceType = "O" | "KR" | "TASK_TARGET" | "PROJECT" | "PROJECT_MENU" | "MAIN_TASK" | "SUB_TASK";
export type ICheckedCallback = (val: { type: OperationType, checkedArr: any[] }) => void;
