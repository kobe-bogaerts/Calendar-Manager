import { Week } from './Week';

export interface WeekSerial {
    uid: string;
    beginDate: Date;
    endDate: Date;
    data: string;
}

export class WeekSerializer{
    static serializeWeek(week: Week): WeekSerial{
        return {
            uid: week.uid,
            beginDate: week.beginDate,
            endDate: week.endDate,
            data: JSON.stringify(week.data)
        }
    }

    private static parseWeek(sWeek: WeekSerial): Week{
        return {
            uid: sWeek.uid,
            beginDate: sWeek.beginDate,
            endDate: sWeek.endDate,
            data: JSON.parse(sWeek.data)
        }
    }

    static parseWeeks(sWeeks: WeekSerial[]): Week[]{
        const weeks = [];
        for (const sWeek of sWeeks) {
            weeks.push(this.parseWeek(sWeek));
        }
        return weeks;
    }

}