import { ICard, ICardsData } from "../../types";
import { IEvents } from "../base/events";

export class CardsData implements ICardsData {
    private _cards: ICard[];
    private _cardPreview: ICard;
    private _basket: ICard[];
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._cards = [];
        this._basket = [];
    }

    set cards(items: ICard[]) {
        this._cards = items;
        this.events.emit('cardsData:changed');
    }

    get cards(): ICard[]  {
        return this._cards;
    }

    get cardPreview(): ICard {
        return this._cardPreview;
    }

    getCard(cardId: string): ICard {
        return this._cards.find(item => item.id === cardId);
    }

    addCardToBasket(cardId: string): void {
        const card = this.getCard(cardId);
        this.basket.push(card);
        this.events.emit(`basket:update`);
    }

    get basket() {
        return this._basket;
    }

    set basket(cards: ICard[]) {
        this._basket = cards;
        this.events.emit(`basket:update`);

    }

    getBasketCardCount(): number {
        return this.basket.length;
    }

    getBasketTotal(): number {
        return this.basket.reduce((total, card) => total + card.price, 0);
    }

    clearBasket(): void {
        this._basket = [];
        this.events.emit(`basket:update`)
    }

    removeCardFromBasket(cardId: string): void {
        const cardToDelete = this.basket.findIndex(card => card.id === cardId);
        this.basket.splice(cardToDelete, 1);
        this.events.emit(`basket:update`);
    }

    cardInBasket(card: ICard): boolean {
        return this._basket.some(item => item.id === card.id);
    }
}