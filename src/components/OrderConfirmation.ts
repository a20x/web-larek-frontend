
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IOrderConfirmation {
    total(value: number): void
}

export class OrderConfirmation extends Component<IOrderConfirmation> {
    private _total: HTMLElement;
    events: IEvents;
    private button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this._total = this.container.querySelector('.order-success__description') as HTMLElement;
        this.button = this.container.querySelector('.button') as HTMLButtonElement;

        this.button.addEventListener('click', (evt) => {
            evt.preventDefault();
            events.emit(`success:submit`);
        })
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`)
    }
}