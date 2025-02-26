import { IOrderData, TOrderValidationData, TUserOrderInfo } from '../../types';
import { IEvents } from '../base/events';


export class OrderData implements IOrderData {
	private _address: string;
	private _phone: string;
	private _email: string;
	private _payment: string;
	events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set address(address: string) {
		this._address = address;
		this.events.emit(`address: updated`);
	}

	set phone(phone: string) {
		this._phone = phone;
		this.events.emit(`phone: updated`);
	}

	set email(email: string) {
		this._email = email;
		this.events.emit(`email: updated`);
	}

	set payment(payment: string) {
		this._payment = payment;
		this.events.emit(`payment: updated`, {payment: this._payment});
	}

	getOrderData(): TUserOrderInfo {
		return {
			address: this._address,
			phone: this._phone,
			email: this._email,
			payment: this._payment,
		};
	}

	validateAddress(data: TOrderValidationData) {
		return data.value !== '';
	}

	validatePhone(data: TOrderValidationData) {
		return data.value !== '';
	}

	validateEmail(data: TOrderValidationData) {
		return data.value !== '';
	}

	validatePayment(payment: string) {
		return payment === 'card' || payment === 'cash';
	}

	validateOrderForm() {
		return Boolean((this._address ?? '').trim() && (this._payment ?? '').trim());
	}

	validateContactsForm() {
		return Boolean((this._email ?? '').trim() && (this._phone ?? '').trim());
	}

	clearData() {
		this._address = '';
		this._email = '';
		this._payment = '';
		this._phone = '';
		this.events.emit(`data: cleared`)
	}
}
