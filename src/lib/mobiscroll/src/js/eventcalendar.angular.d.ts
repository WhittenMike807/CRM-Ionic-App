import { MbscDataControlBase, ElementRef, NgZone } from './frameworks/angular';
import './presets/eventcalendar';
export declare class MbscEventcalendar extends MbscDataControlBase {
    constructor(initialElem: ElementRef, zone: NgZone);
    setNewValue(v: any): void;
    refreshData(newData: any): void;
    ngAfterViewInit(): void;
}
