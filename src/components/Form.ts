import { Component } from "./base/Component";
import { IEvents } from "./base/events";

abstract class Form<T> extends Component<T> {
    protected form: HTMLFormElement;
    events: IEvents;
    protected formName: string;
	protected inputs: NodeListOf<HTMLInputElement>;
    protected _errors: HTMLElement;
    protected _submit: HTMLButtonElement;
    protected errorMessages: Record<string, string>;

    constructor(form: HTMLFormElement, events: IEvents) {
        super(form);
        this.form = form;
        this.events = events;
        this.inputs = this.form.querySelectorAll<HTMLInputElement>('.form__input');
        this.formName = this.form.getAttribute('name');
        this._errors = this.form.querySelector('.form__errors') as HTMLElement;
        this._submit = this.form.querySelector('button[type=submit]') as HTMLButtonElement;
        this.errorMessages = {};

        this.form.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;

            this.events.emit(`${this.formName}:input`, {field, value});
            this.checkFormValidity();
        });

         this.form.addEventListener(('submit'), (event) => {
            event.preventDefault();
            this.handleSubmit();
        })
    }

    protected handleSubmit() {
        const inputValues = this.getInputValues();
        this.events.emit(`${this.formName}:submit`, inputValues);
    }

    protected getInputValues() {
        const valuesObject: Record<string, string> = {};
        this.inputs.forEach((element) => {
            valuesObject[element.name] = element.value;
        })
        return valuesObject;
    }

    protected checkFormValidity() {
        const validInputs = Array.from(this.inputs).every(item => item.value !== '');

        this.valid = validInputs;
    }

    setErrorMessages(field: string, message: string) {
        this.errorMessages[field] = message;
        this.displayErrors();
    }

    clearError(field: string) {
        delete this.errorMessages[field];
        this.displayErrors();
    }

    protected displayErrors() {
        const errorText = Object.values(this.errorMessages).join('; ')
        this.errors = errorText;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    clearForm() {
        this.form.reset();
    }
}

interface IContacts {
    errors: Record<string, string>;
}

export class Contacts extends Form<IContacts> {
    constructor(form: HTMLFormElement, events: IEvents) {
        super(form, events);
    }
}

interface IOrder extends IContacts {
    paymentButtons: HTMLButtonElement[];
}

export class Order extends Form<IOrder> {
    private paymentButtons: HTMLButtonElement[];
    private selectedPayment: string;
    private addressField: HTMLInputElement;

    constructor(form: HTMLFormElement, events: IEvents) {
        super(form, events);
        this.paymentButtons = Array.from(this.form.querySelectorAll('.button_alt')) as HTMLButtonElement[];
        this.addressField = this.form.querySelector(`[name = 'address']`) as HTMLInputElement;

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.activePaymentButton(button.name);
                this.checkFormValidity();
            })
        });
    }

    protected handleSubmit() {
        const inputValues = this.getInputValues();
        const submitData = {
            ...inputValues,
            payment: this.selectedPayment
        }
        this.events.emit(`${this.formName}:submit`, submitData);
    }

    protected activePaymentButton(buttonName: string) {
        this.paymentButtons.forEach((button) => {
            button.classList.remove('button_alt-active');
        });

        const button = this.paymentButtons.find(item => item.name === buttonName);
        if (button) {
            this.toggleClass(button, 'button_alt-active');
            this.selectedPayment = button.textContent;
        }
    }

    protected checkFormValidity() {
        const addressValid = this.addressField.value !== '';
        const buttonSelected = this.selectedPayment !== '' && this.selectedPayment !== undefined;

        this.valid = addressValid && buttonSelected;
    }
}
