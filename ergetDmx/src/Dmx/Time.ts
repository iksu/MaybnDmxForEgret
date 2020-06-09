//时间类
class Time {
    public constructor() {
    }

    public static ParseTime(val: string): Date {
        var vals: Array<string> = val.split(" ");
        var dates: Array<string> = vals[0].split("-");
        var times: Array<string> = vals[1].split(":");
        return new Date(dates[0].ToInt(), (dates[1].ToInt() - 1), dates[2].ToInt(), times[0].ToInt(), times[1].ToInt(), times[2].ToInt());
    }

    public static ParseString(val: Date): string {
        return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate() + " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
    }

    public static ParseStringWithMilliseconds(val: Date): string {
        return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate() + " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds() + "." + val.getMilliseconds();
    }

    public static GetTimeSpan(seconds: number): string {
        var day: number = Math.floor(seconds / (3600 * 24));
        seconds = seconds - 3600 * 24 * day;
        var hour: number = Math.floor(seconds / 3600);
        seconds = seconds - 3600 * hour;
        var minute: number = Math.floor(seconds / 60);
        seconds = seconds - minute * 60;
        if (day == 0) {
            return Strx.PaddingLeft(hour.toString(), 2, "0") + ":" + Strx.PaddingLeft(minute.toString(), 2, "0") + ":" + Strx.PaddingLeft(seconds.toString(), 2, "0");
        }
        else {
            if (Lang.type == LangType.Chs || Lang.type == LangType.Cht) {
                return day + "." + Strx.PaddingLeft(hour.toString(), 2, "0") + ":" + Strx.PaddingLeft(minute.toString(), 2, "0") + ":" + Strx.PaddingLeft(seconds.toString(), 2, "0");
            } else {
                return day + "d" + Strx.PaddingLeft(hour.toString(), 2, "0") + ":" + Strx.PaddingLeft(minute.toString(), 2, "0") + ":" + Strx.PaddingLeft(seconds.toString(), 2, "0");
            }
        }
    }

    public static get Now(): DateTime {
        return new DateTime(new Date());
    }

    // public static MyTime2UTc(dt: string): Date {
    //     var dts = new Date(Data.startTimeUtc.getTime() + Time.ParseTime(dt).getTime() - Data.localTime.getTime());
    //     return dts;//这个方法暂时不要用，是算本地时间，会有误解
    // }
}

window["Time"] = Time;