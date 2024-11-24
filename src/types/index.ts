export interface ICard {
    _id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
}

export interface IOrder {
    address: string;
    phone: number
    email: string;
    paymentMethod: string;
    total: string;
    items: TItemId[];
}

export interface ICardsData {
    cards: ICard[];
    cardPreview: string | null; 
    addCard(card: ICard) : void;
    deleteCard(cardId: string, payload: Function | null): void;
    updateCard(card: ICard, payload: Function | null): void;
    getCard(cardId: string): ICard;
}

export interface IOrderData {
    getOrderInfo(): TUserOrderInfo;
    setUserInfo(userData: IOrder): void;
    validateOrderInfo(data: Record<keyof TUserOrderInfo, string>): void
}

export type TBasketInfo = Pick<ICard, '_id' | 'title' | 'price'>;

export type TItemId = Pick<ICard, '_id'>;

export type TUserOrderInfo = Pick<IOrder, 'paymentMethod' | 'address' | 'phone' | 'email'>;

export type TUserOrderAddressInfo = Pick<IOrder, 'paymentMethod' | 'address'>;

export type TUserPersonalInfo = Pick<IOrder, 'phone' | 'email'>;

