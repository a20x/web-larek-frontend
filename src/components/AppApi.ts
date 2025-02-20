import { IApi, ICard, IOrder, IOrderRes } from "../types";


export class AppApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    productList(): Promise<{total: number, items: ICard[]}> {
        return this._baseApi.get<{total: number, items: ICard[]}>(`/product`);
    }

    order(data: IOrder): Promise<IOrderRes> {
        return this._baseApi.post<IOrderRes>(`/order`, data, 'POST').then((res: IOrderRes) => res);
    }
}