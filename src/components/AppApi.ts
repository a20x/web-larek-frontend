import { ICard, IOrder, IOrderRes } from "../types";
import { Api } from "./base/api";


export class AppApi {
    private baseApi: Api;

    constructor(baseApi: Api) {
        this.baseApi = baseApi;
    }

    productList(): Promise<{ total: number; items: ICard[] }> {
        return this.baseApi.get(`/product`).then(res => res as { total: number; items: ICard[] });
    }

    order(data: IOrder): Promise<IOrderRes> {
        return this.baseApi.post(`/order`, data, 'POST').then(res => res as IOrderRes);
    }
}

