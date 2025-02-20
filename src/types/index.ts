import { ApiPostMethods } from "../components/base/api";
import { IEvents } from "../components/base/events";

export interface ICard {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
    categoryClass: string,
}

export interface IOrder {
    address: string;
    phone: string;
    email: string;
    payment: string;
    total: number;
    items: string[];
}

export interface ICardsData {
    cards: ICard[];
    cardPreview: ICard;
    events: IEvents;
    basket: ICard[];
    getCard(cardId: string): ICard;
    addCardToBasket(cardId: string): void;
    getBasketCardCount(): number;
    getBasketTotal(): number;
    clearBasket(): void;
    removeCardFromBasket(cardId: string): void;
}

export type TOrderValidationData = {field: string, value: string};

export interface IOrderData {
    address: string;
    phone: string;
    email: string;
    payment: string;
    events: IEvents;

    getOrderData(): TUserOrderInfo;
    validateAddress(data: TOrderValidationData): boolean;
    validatePhone(data: TOrderValidationData): boolean;
    validateEmail(data: TOrderValidationData): boolean;
    validatePayment(payment: string): boolean;
}

export type TBasketInfo = Pick<ICard, 'id' | 'title' | 'price'>;

export type TUserOrderInfo = Pick<IOrder, 'payment' | 'address' | 'phone' | 'email'>;

export type TUserOrderAddressInfo = Pick<IOrder, 'payment' | 'address'>;

export type TUserPersonalInfo = Pick<IOrder, 'phone' | 'email'>;

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IOrderRes {
    id: string;
    total: number;
}


