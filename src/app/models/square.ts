export class Square {
    public value = 0;
    public showsAdj: number[][] = [];
    public status: 'hidden'| 'hidden flagged' | 'visible' | 'detonated detonation' = 'hidden';
}
