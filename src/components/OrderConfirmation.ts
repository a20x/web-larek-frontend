import { IEvents } from "./base/events";

export class OrderConfirmation {
    private container: HTMLElement;
    private _total: HTMLElement;
    events: IEvents;
    private button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        this.container = container;
        this.events = events;

        this._total = this.container.querySelector('.order-success__description') as HTMLElement;
        this.button = this.container.querySelector('.button') as HTMLButtonElement;

        this.button.addEventListener('click', (evt) => {
            evt.preventDefault();
            events.emit(`success:submit`);
        })
    }

    set total(value: number) {
        this._total.textContent = `Списано ${value} синапсов`;
    }
}