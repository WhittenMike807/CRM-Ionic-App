import { ElementRef, NgZone, MbscBase, AfterViewInit, OnDestroy, Observable } from './frameworks/angular';
export declare class MbscListviewService {
    private addSubject;
    private removeSubject;
    notifyAdded(item: any): void;
    notifyRemoved(item: any): void;
    onItemAdded(): Observable<any>;
    onItemRemoved(): Observable<any>;
}
export declare class MbscListviewItem implements AfterViewInit, OnDestroy {
    private elem;
    private lvService;
    id: number;
    icon: string;
    iconAlign: string;
    type: string;
    readonly Index: any;
    readonly Element: any;
    constructor(elem: ElementRef, lvService: MbscListviewService);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscListviewHeader {
    constructor(elem: ElementRef);
}
export declare class MbscListview extends MbscBase {
    private elem;
    zone: NgZone;
    private lvService;
    options: any;
    constructor(elem: ElementRef, zone: NgZone, lvService: MbscListviewService);
    ngAfterViewInit(): void;
}
