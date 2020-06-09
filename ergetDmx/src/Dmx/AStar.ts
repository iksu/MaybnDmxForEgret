class AStar {
    private static BLOCK_WAY: number = 1;
    private static AROUND_POINTS: any = [new Vector2(1, 0),
    new Vector2(0, 1),
    new Vector2(-1, 0),
    new Vector2(0, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
    new Vector2(-1, -1),
    new Vector2(1, -1)];

    private static COST_DIAGONAL: number = 14;
    private static COST_STRAIGHT: number = 10;
    private static NOTE_OPEN: number = 1;
    private static NOTE_ID: number = 0;
    private static NOTE_CLOSED: number = 2;

    private static _instance: AStar;

    private static blocks: Vector2Hash;
    private static _mapWalkDataMaxX: number;
    private static _mapWalkDataMaxY: number;
    private static _fatherList: any;
    private static _noteMap: Array<any>;
    private static _openId: number;
    private static _nodeList: any;
    private static _openCount: number;
    private static _openList: any;
    private static _pathScoreList: any;
    private static _movementCostList: any;
    public static maxTry: number = 5000;

    public static Init(dataList: Vector2Hash) {
        AStar.blocks = dataList;
        if (AStar.blocks) {
            AStar._mapWalkDataMaxX = AStar.blocks.width - 1;
            AStar._mapWalkDataMaxY = AStar.blocks.length - 1;
        };
    }
    public static Find(p_start: Vector2, p_end: Vector2, isOptimize: boolean = true): any {
        if (AStar.blocks.ExistsPoint(p_end)) {
            //找出最近点的end
            var expert: number = 36;
            var axingOffset: number = 2;
            var newEnd: Vector2 = null;
            for (var i: number = 1; i < expert * axingOffset; i += axingOffset) {
                var p: Vector2 = new Vector2(p_end.x - i, p_end.y);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                p = new Vector2(p_end.x + i, p_end.y);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                //
                p = new Vector2(p_end.x, p_end.y - i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                p = new Vector2(p_end.x, p_end.y + i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                //
                p = new Vector2(p_end.x - i, p_end.y - i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                p = new Vector2(p_end.x - i, p_end.y + i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                //
                p = new Vector2(p_end.x + i, p_end.y - i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                p = new Vector2(p_end.x + i, p_end.y + i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
            }
            p_end = newEnd;
            if (p_end == null) {
                return null;
            }
        }

        var aroundPoint: Vector2;
        var path: any;
        var f1: number;
        var f2: number;
        var n: number;
        var firstDataInOpen: number;
        var curPoint: Vector2;
        if (AStar.blocks == null) {
            return (null);
        };
        AStar.InitLists();
        AStar._openCount = 0;
        AStar._openId = -1;
        AStar.OpenNote(p_start, 0, 0, 0);
        var tryNum: number;
        while (AStar._openCount > 0) {
            ++tryNum;
            if (tryNum > AStar.maxTry) {
                AStar.DestroyLists();
                return (null);
            };
            firstDataInOpen = AStar._openList[0];
            AStar.CloseNote(firstDataInOpen);
            curPoint = AStar._nodeList[firstDataInOpen];
            if (p_end.Equals(curPoint)) {
                path = AStar.GetPath(p_start, firstDataInOpen, isOptimize);
                return (path);
            };
            AStar.GetArounds(curPoint).forEach((aroundPoint) => {
                f1 = (AStar._movementCostList[firstDataInOpen] + ((aroundPoint.y == curPoint.y)) ? AStar.COST_STRAIGHT : AStar.COST_DIAGONAL);
                f2 = (f1 + ((Math.abs((p_end.x - aroundPoint.x)) + Math.abs((p_end.y - aroundPoint.y))) * AStar.COST_STRAIGHT));
                if (AStar.IsOpen(aroundPoint)) {
                    n = AStar._noteMap[aroundPoint.y][aroundPoint.x][AStar.NOTE_ID];
                    if (f1 < AStar._movementCostList[n]) {
                        AStar._movementCostList[n] = f1;
                        AStar._pathScoreList[n] = f2;
                        AStar._fatherList[n] = firstDataInOpen;
                        AStar.AheadNote((AStar._openList.indexOf(n) + 1));
                    };
                } else {
                    AStar.OpenNote(aroundPoint, f2, f1, firstDataInOpen);
                };
            });
        };
        AStar.DestroyLists();
        return (null);
    }
    private static IncisePath(path: any): void {
        var targetPoint: Vector2;
        var distance: number;
        var pointIdx: number = 1;
        var startPoint: Vector2 = path[0];
        while (pointIdx < path.length) {
            targetPoint = path[pointIdx];
            distance = startPoint.Distance(targetPoint);
            if (distance > 8) {
                path.splice(pointIdx, (path.length - pointIdx));
                return;
            };
            pointIdx++;
        };
    }
    private static IsOpen(p: Vector2): boolean {
        if (AStar._noteMap[p.y] == null) {
            return (false);
        };
        if (AStar._noteMap[p.y][p.x] == null) {
            return (false);
        };
        return (AStar._noteMap[p.y][p.x][AStar.NOTE_OPEN]);
    }
    private static AheadNote(index: number): void {
        var curIdx: number;
        var n: number;
        while (index > 1) {
            curIdx = index / 2;
            if (AStar.GetScore(index) < AStar.GetScore(curIdx)) {
                n = AStar._openList[(index - 1)];
                AStar._openList[(index - 1)] = AStar._openList[(curIdx - 1)];
                AStar._openList[(curIdx - 1)] = n;
                index = curIdx;
            } else {
                break;
            };
        };
    }
    private static OpenNote(p: Vector2, score: number, cost: number, fatherId: number): void {
        AStar._openCount++;
        AStar._openId++;
        if (AStar._noteMap[p.y] == null) {
            AStar._noteMap[p.y] = [];
        };
        AStar._noteMap[p.y][p.x] = [];
        AStar._noteMap[p.y][p.x][AStar.NOTE_OPEN] = true;
        AStar._noteMap[p.y][p.x][AStar.NOTE_ID] = AStar._openId;
        AStar._nodeList.push(p);
        AStar._pathScoreList.push(score);
        AStar._movementCostList.push(cost);
        AStar._fatherList.push(fatherId);
        AStar._openList.push(AStar._openId);
        AStar.AheadNote(AStar._openCount);
    }
    private static Optimize(pointList: any, fromIndex: number = 0): void {
        var curPoint: Vector2;
        var xx: number;
        var yy: number;
        var distance: number;
        var vx: number;
        var vy: number;
        var mx: number;
        var my: number;
        var curDistance: number;
        var canPassLine: boolean;
        if (pointList == null) {
            return;
        };
        var pointCount: number = (pointList.length - 1);
        if (pointCount < 2) {
            return;
        };
        var fromPoint: Vector2 = pointList[fromIndex];
        var curIndex: number = pointCount;
        while (curIndex > fromIndex) {
            curPoint = pointList[curIndex];
            xx = (curPoint.x - fromPoint.x);
            yy = (curPoint.y - fromPoint.y);
            distance = Math.round(Math.sqrt(((xx * xx) + (yy * yy))));
            vx = (xx / distance);
            vy = (yy / distance);
            mx = vx;
            my = vy;
            curDistance = 1;
            canPassLine = true;
            while (curDistance < distance) {
                if (AStar.CanPass(fromPoint.Move(Math.round(mx), Math.round(my))) == false) {
                    canPassLine = false;
                    break;
                };
                mx = (mx + vx);
                my = (my + vy);
                curDistance++;
            };
            if (canPassLine) {
                pointList.splice((fromIndex + 1), ((curIndex - fromIndex) - 1));
                break;
            };
            curIndex--;
        };
        fromIndex++;
        if (fromIndex < (pointList.length - 1)) {
            AStar.Optimize(pointList, fromIndex);
        };
    }
    private static Optimize2(pointList: any, fromIndex: number = 0): void {
        var curPoint: Vector2;
        var xx: number;
        var yy: number;
        var steps: number;
        var canPassLine: boolean;
        var i: number;
        var dx: number;
        var dy: number;
        var mx: number;
        var my: number;
        if (pointList == null) {
            return;
        };
        var pointCount: number = (pointList.length - 1);
        if (pointCount < 2) {
            return;
        };
        var fromPoint: Vector2 = pointList[fromIndex];
        var curIndex: number = pointCount;
        while (curIndex > fromIndex) {
            curPoint = pointList[curIndex];
            xx = Math.abs((curPoint.x - fromPoint.x));
            yy = Math.abs((curPoint.y - fromPoint.y));
            if (xx > yy) {
                steps = xx;
            } else {
                steps = yy;
            };
            canPassLine = true;
            i = 1;
            while (i < steps) {
                dx = (curPoint.x - fromPoint.x);
                dy = (curPoint.y - fromPoint.y);
                mx = Math.round(((Math.abs(dx) * i) / steps));
                if (dx < 0) {
                    mx = -(mx);
                };
                my = Math.round(((Math.abs(dy) * i) / steps));
                if (dy < 0) {
                    my = -(my);
                };
                if (AStar.CanPass(fromPoint.Move(mx, my)) == false) {
                    canPassLine = false;
                    break;
                };
                i++;
            };
            if (canPassLine) {
                pointList.splice((fromIndex + 1), ((curIndex - fromIndex) - 1));
                break;
            };
            curIndex--;
        };
        fromIndex++;
        if (fromIndex < (pointList.length - 1)) {
            AStar.Optimize2(pointList, fromIndex);
        };
    }
    private static CloseNote(id: number): void {
        AStar._openCount--;
        var node: Vector2 = AStar._nodeList[id];
        AStar._noteMap[node.y][node.x][AStar.NOTE_OPEN] = false;
        AStar._noteMap[node.y][node.x][AStar.NOTE_CLOSED] = true;
        if (AStar._openCount <= 0) {
            AStar._openCount = 0;
            AStar._openList.length = 0;
            return;
        };
        AStar._openList[0] = AStar._openList.pop();
        AStar.BackNote();
    }
    private static GetScore(index: number): number {
        return (AStar._pathScoreList[AStar._openList[(index - 1)]]);
    }
    private static GetArounds(p: Vector2): any {
        var nearPoint: Vector2;
        var point: Vector2;
        var aroundPointList = [];
        AStar.AROUND_POINTS.forEach((point) => {
            nearPoint = p.Move(point.x, point.y);
            if (AStar.CanPass(nearPoint)) {
                if (!(AStar.IsClosed(nearPoint))) {
                    aroundPointList.push(nearPoint);
                };
            };
        });
        return (aroundPointList);
    }
    private static CanPass(p: Vector2): boolean {
        if ((((((((p.x < 0)) || ((p.x > AStar._mapWalkDataMaxX)))) || ((p.y < 0)))) || ((p.y > AStar._mapWalkDataMaxY)))) {
            return (false);
        };
        return !AStar.blocks.ExistsPoint(p);
    }
    private static GetPath(p_start: Vector2, id: number, isOptimize: boolean): any {
        var pathNodeList = [];
        var node: Vector2 = AStar._nodeList[id];
        while (!(p_start.Equals(node))) {
            pathNodeList.push(node);
            id = AStar._fatherList[id];
            node = AStar._nodeList[id];
        };
        pathNodeList.push(p_start);
        AStar.DestroyLists();
        pathNodeList.reverse();
        if (isOptimize) {
            AStar.Optimize2(pathNodeList);
        };
        return (pathNodeList);
    }
    private static InitLists(): void {
        AStar._openList = [];
        AStar._nodeList = [];
        AStar._pathScoreList = [];
        AStar._movementCostList = [];
        AStar._fatherList = [];
        AStar._noteMap = new Array();
    }
    private static IsClosed(p: Vector2): boolean {
        if (AStar._noteMap[p.y] == null) {
            return (false);
        };
        if (AStar._noteMap[p.y][p.x] == null) {
            return (false);
        };
        return (AStar._noteMap[p.y][p.x][AStar.NOTE_CLOSED]);
    }
    private static DestroyLists(): void {
        AStar._openList = null;
        AStar._nodeList = null;
        AStar._pathScoreList = null;
        AStar._movementCostList = null;
        AStar._fatherList = null;
        AStar._noteMap = null;
    }
    private static BackNote(): void {
        var temp: number;
        var n1: number;
        var n2: number = 1;
        while (true) {
            n1 = n2;
            if ((2 * n1) <= AStar._openCount) {
                if (AStar.GetScore(n2) > AStar.GetScore((2 * n1))) {
                    n2 = (2 * n1);
                };
                if (((2 * n1) + 1) <= AStar._openCount) {
                    if (AStar.GetScore(n2) > AStar.GetScore(((2 * n1) + 1))) {
                        n2 = ((2 * n1) + 1);
                    };
                };
            };
            if (n1 == n2) {
                break;
            };
            temp = AStar._openList[(n1 - 1)];
            AStar._openList[(n1 - 1)] = AStar._openList[(n2 - 1)];
            AStar._openList[(n2 - 1)] = temp;
        };
    }
}

window["AStar"] = AStar;