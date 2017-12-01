import { MbscBase, ElementRef } from './frameworks/angular';
export declare class MbscPage extends MbscBase {
    options: any;
    initElem: ElementRef;
    constructor(hostElement: ElementRef);
    ngAfterViewInit(): void;
}
