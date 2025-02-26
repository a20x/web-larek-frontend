import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface ICardsContainer {
    events: IEvents;
    catalog: HTMLElement[];
    headerBasketCounter: number;
}

export class CardsContainer extends Component<ICardsContainer> {
    private _headerBasketCounter: HTMLSpanElement;
    private headerBasket: HTMLButtonElement;
    private gallery: HTMLElement;
    events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.gallery = this.container.querySelector('.gallery');
        this.headerBasket = this.container.querySelector('.header__basket');
        this._headerBasketCounter = this.container.querySelector('.header__basket-counter');

        
        this.headerBasket.addEventListener('click', () => {
            events.emit(`basket:open`);
        })
    }

    set catalog(items: HTMLElement[]) {
        this.gallery.replaceChildren(...items);
    }

    set headerBasketCounter(amount: number) {
        this.setText(this._headerBasketCounter, amount)
    }
}