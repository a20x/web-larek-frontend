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
		this.events.emit(`address:updated`);
	}

	set phone(phone: string) {
		this._phone = phone;
		this.events.emit(`phone:updated`);
	}

	set email(email: string) {
		this._email = email;
		this.events.emit(`email:updated`);
	}

	set payment(payment: string) {
		this._payment = payment;
		this.events.emit(`payment:updated`);
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
		if (data.value !== '') {
			this.events.emit(`address:valid`, data);
			return true;
		} else {
			this.events.emit(`address:invalid`);
			return false;
		}
	}

	validatePhone(data: TOrderValidationData) {
		if (data.value !== '') {
			this.events.emit(`phone:valid`, data);
			return true;
		} else {
			this.events.emit(`phone:invalid`);
			return false;
		}
	}

	validateEmail(data: TOrderValidationData) {
		if (data.value !== '') {
			this.events.emit(`email:valid`, data);
			return true;
		} else {
			this.events.emit(`email:invalid`);
			return false;
		}
	}

	validatePayment(payment: string) {
		if (payment) {
			this.events.emit(`payment:valid`);
			return true;
		} else {
			this.events.emit(`payment:invalid`);
			return false;
		}
	}
}
