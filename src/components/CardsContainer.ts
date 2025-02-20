import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class CardsContainer<T> extends Component<T> {
    private _headerBasketCounter: HTMLSpanElement;
    private headerBasket: HTMLButtonElement;
    events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.headerBasket = document.querySelector('.header__basket');
        this._headerBasketCounter = document.querySelector('.header__basket-counter');
        
        this.headerBasket.addEventListener('click', () => {
            events.emit(`basket:open`);
        })
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }

    set headerBasketCounter(amount: number) {
        this._headerBasketCounter.textContent = `${amount}`;
    }
}