import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IContacts {
    setErrorMessages(field: string, message: string): void;
    clearError(field: string): void;
    changeSubmitButtonState(state: boolean): void;
    clearForm(): void;
}

export class Contacts extends Component<IContacts> {
    events: IEvents;
    protected formName: string;
	protected inputs: NodeListOf<HTMLInputElement>;
    protected errorsField: HTMLElement;
    protected submitButton: HTMLButtonElement;
    protected errorMessages: Record<string, string>;

    constructor(form: HTMLFormElement, events: IEvents) {
        super(form);
        this.events = events;
        this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
        this.formName = this.container.getAttribute('name');
        this.errorsField = this.container.querySelector('.form__errors') as HTMLElement;
        this.submitButton = this.container.querySelector('button[type=submit]') as HTMLButtonElement;
        this.errorMessages = {};

        this.container.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;

            this.events.emit(`${this.formName}: input`, {field, value});
        });

         this.container.addEventListener(('submit'), (event) => {
            event.preventDefault();
            this.events.emit(`${this.formName}: submit`);
        })
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
        this.setText(this.errorsField, errorText);
    }

    changeSubmitButtonState(state: boolean) {
        this.setDisabled(this.submitButton, !state);
    }

    clearForm() {
        this.inputs.forEach(input => input.value = '')
    }
}