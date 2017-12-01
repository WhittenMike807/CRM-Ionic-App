import { MbscDataControlBase, ElementRef, NgZone, NgControl, EventEmitter, MbscInputService } from './frameworks/angular';
import './presets/select';
export declare class MbscSelect extends MbscDataControlBase {
    target: any;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService);
    refreshData(newData: any): void;
    ngAfterViewInit(): void;
}
