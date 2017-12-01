import { EventEmitter, ElementRef, QueryList, MbscBase, Observable, NgZone } from './frameworks/angular';
export declare class MbscMenustripService {
    private _instanceSubject;
    notifyInstanceRead(instance: any): void;
    onInstanceReady(): Observable<any>;
}
export declare class MbscMenustripItem {
    private _menustripService;
    private _elem;
    private _selected;
    private _disabled;
    icon: string;
    disabled: boolean;
    selected: boolean;
    selectedChange: EventEmitter<boolean>;
    readonly nativeElement: any;
    private _instance;
    constructor(_menustripService: MbscMenustripService, _elem: ElementRef);
    toggle(): void;
}
export declare class MbscMenustrip extends MbscBase {
    zone: NgZone;
    private _menustripService;
    options: any;
    rootElem: ElementRef;
    items: QueryList<MbscMenustripItem>;
    constructor(initialElem: ElementRef, zone: NgZone, _menustripService: MbscMenustripService);
    ngAfterViewInit(): void;
    tapHandler(event: any, inst: any): void;
    private _getItem(nativeEl);
}
