import { MbscDataControlBase, ElementRef, NgZone, NgControl, EventEmitter, MbscInputService } from './frameworks/angular';
export declare class MbscColor extends MbscDataControlBase {
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService);
    refreshData(newData: any): void;
    ngAfterViewInit(): void;
}
