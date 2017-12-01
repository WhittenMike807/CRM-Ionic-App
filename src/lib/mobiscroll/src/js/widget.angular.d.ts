import { ElementRef, MbscBase } from './frameworks/angular';
export declare class MbscWidget extends MbscBase {
    options: any;
    constructor(initialElem: ElementRef);
    ngAfterViewInit(): void;
}
