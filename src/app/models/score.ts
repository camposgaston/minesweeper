export interface IScore {
    score: number;
    player: string;
    level: 'Easy' | 'Medium' | 'Hard' | 'Defined by Player';
    difficulty: number;
    startTime: string;
    endTime: string;
    spentTime: number;
    status: 'Won' | 'Lost';
}
export class Score implements IScore {

    constructor(
        public score: number,
        public player: string,
        public level: 'Easy' | 'Medium' | 'Hard' | 'Defined by Player',
        public difficulty: number,
        public startTime: string,
        public endTime: string,
        public spentTime: number,
        public status: 'Won' | 'Lost'
    ) {

    }
}
