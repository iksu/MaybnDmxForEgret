class TimeSpan {
    private tick: number;
    public constructor(tick: number) {
        this.tick = tick;

        // var day: number = Math.floor(this.TotalMinutes / (3600 * 24));
        // var seconds = seconds - 3600 * 24 * day;
        // var hour: number = Math.floor(seconds / 3600);
        // seconds = seconds - 3600 * hour;
        // var minute: number = Math.floor(seconds / 60);
        // seconds = seconds - minute * 60;
    }

    public get TotalDay(): number {
        return this.tick / (1000 * 60 * 60 * 24);
    }
    public get TotalHour(): number {
        return this.tick / (1000 * 60 * 60);
    }

    public get TotalMinutes(): number {
        return this.tick / (1000 * 60);
    }

    public get TotalSeconds(): number {
        return this.tick / 1000;
    }

    public get TotalMilliseconds(): number {
        return this.tick;
    }
}

window["TimeSpan"] = TimeSpan;