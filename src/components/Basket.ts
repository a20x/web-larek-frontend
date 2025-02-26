
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasket {
    basketList: HTMLElement[];
    basketPrice: number;
    setSubmitDisabled(state: boolean): void;
}

export class Basket extends Component<IBasket> {
    private _basketList: HTMLElement;
    private _basketPrice: HTMLSpanElement;
    private _basketButton: HTMLButtonElement;
    events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this._basketList = this.container.querySelector('.basket__list') as HTMLElement;
        this._basketPrice = this.container.querySelector('.basket__price') as HTMLSpanElement;
        this._basketButton = this.container.querySelector('.basket__button') as HTMLButtonElement;

        this._basketButton.addEventListener('click', () => {
            this.events.emit(`basket:submit`);
        })
    }

    set basketList(cards: HTMLElement[]) {
        this._basketList.replaceChildren(...cards);
    }

    set basketPrice(total: number) {
        this.setText(this._basketPrice, `${total} синапсов`)
    }

    setSubmitDisabled(state: boolean) {
        this.setDisabled(this._basketButton, state);
    }
}