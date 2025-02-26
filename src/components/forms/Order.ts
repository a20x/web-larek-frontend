
import { IEvents } from "..//base/events";
import { Contacts, IContacts } from "./Contacts";

export interface IOrder extends IContacts {
    activePaymentButton(payment: string): void;
}

export class Order extends Contacts implements IOrder {
    private paymentButtons: HTMLButtonElement[];

    constructor(form: HTMLFormElement, events: IEvents) {
        super(form, events);

        this.paymentButtons = Array.from(this.container.querySelectorAll('.button_alt')) as HTMLButtonElement[];

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                events.emit(`payment: selected`, {payment: button.name})
            })
        });
    }

    activePaymentButton(payment: string) {
        this.paymentButtons.forEach((button) => {
            button.classList.remove('button_alt-active');
        });

        const button = this.paymentButtons.find(item => item.name === payment);
        if (button) {
            this.toggleClass(button, 'button_alt-active');
        }
    }
}