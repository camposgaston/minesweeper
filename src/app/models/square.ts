/* eslint-disable @typescript-eslint/quotes */
export interface ISquare {
    value: number;
    showsAdj: number[][];
    status: 'hidden' | 'hidden flagged' | 'visible' | 'detonated detonation';
}
export class Square implements ISquare {
    public value = 0;
    public showsAdj = [];
    public status: 'hidden' | 'hidden flagged' | 'visible' | 'detonated detonation' = 'hidden';
}
