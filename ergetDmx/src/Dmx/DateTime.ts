//日期时间管理类
class DateTime {
    public d: Date;
    public constructor(d: any = null) {
        if (d == null) {
            d = new Date();
        } else if (d instanceof Date) {
            this.d = d;
        } else if (Strx.IsString(d)) {
            this.d = Time.ParseTime(d.toString());
        } else {
            d = new Date();
        }
    }

    public get time(): number {
        return this.d.getTime();
    }

    public get tick(): number {
        return this.time;
    }

    public get Year(): number {
        return this.d.getFullYear().ToInt();
    }

    public get Month(): number {
        return this.d.getMonth().ToInt();
    }

    // public get DayOfYear(): number {
    //     return this.Month * 31 + this.d.getDate().ToInt();
    // }

    public get DayOfWeek(): number {
        return this.d.getDay().ToInt();
    }

    public get Day(): number {
        return this.d.getDate().ToInt();
    }

    public get Hour(): number {
        return this.d.getHours().ToInt()
    }

    public get Minute(): number {
        return this.d.getMinutes().ToInt();
    }

    public get Second(): number {
        return this.d.getSeconds().ToInt();
    }

    public get Millisecond(): number {
        return this.d.getMilliseconds().ToInt();
    }

    public Add(t: TimeSpan): DateTime {
        let dt: DateTime = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + t.TotalMilliseconds);
        return dt;
    }

    public AddDays(val: number): DateTime {
        let dt: DateTime = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val * 24 * 60 * 60 * 1000);
        return dt;
    }

    public AddHours(val: number): DateTime {
        let dt: DateTime = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val * 60 * 60 * 1000);
        return dt;
    }

    public AddMinutes(val: number): DateTime {
        let dt: DateTime = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val * 60 * 1000);
        return dt;
    }

    public AddSeconds(val: number): DateTime {
        let dt: DateTime = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val * 1000);
        return dt;
    }

    public AddMilliseconds(val: number): DateTime {
        let dt: DateTime = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val)
        return dt;
    }

    public toString(withMilliseconds: boolean = false): string {
        if (withMilliseconds) {
            return Time.ParseStringWithMilliseconds(this.d);
        } else {
            return Time.ParseString(this.d);
        }
    }
}

window["DateTime"] = DateTime;