import { Component } from "../../../../web-larek-frontend-1/src/components/base/Component";
import { IEvents } from "../base/events";

interface IModal {
    open(): void;
    close(): void
    closeOnEsc(evt: KeyboardEvent): void
    setContent(content: HTMLElement): void
    clearModal(): void
}

export class Modal extends Component<IModal> {
    protected modalCloseButton: HTMLButtonElement;
    protected events: IEvents;
    protected modalContent: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container)
        this.events = events;
        this.modalCloseButton = this.container.querySelector('.modal__close');
        this.modalContent = this.container.querySelector('.modal__content')

        this.modalCloseButton.addEventListener('click', this.close.bind(this));

        this.container.addEventListener('mousedown', (evt) => {
            if(evt.target === evt.currentTarget) {
                this.close();
            }
        })
        this.closeOnEsc = this.closeOnEsc.bind(this);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit(`modal:open`);
    }

    close() {
        this.container.classList.remove('modal_active');
        this.events.emit(`modal:close`);
    }

    closeOnEsc(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    }

    setContent(content: HTMLElement) {
        this.clearModal()
        this.modalContent.append(content);
    }

    clearModal() {
        this.modalContent.innerHTML = '';
    }
}