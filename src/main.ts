import "./style.css";

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

class ContactBook {
  private contacts: Contact[] = [];
  private perPage: number = 5;
  private currentPage: number = 1;

  constructor() {
    this.loadContacts();
    this.renderContacts();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    document
      .getElementById("add-contact")!
      .addEventListener("click", () => this.addContact());
    document
      .getElementById("filter")!
      .addEventListener("click", () => this.filterContacts());
    document
      .getElementById("prev-page")!
      .addEventListener("click", () => this.changePage(-1));
    document
      .getElementById("next-page")!
      .addEventListener("click", () => this.changePage(1));
  }

  private loadContacts() {
    const storedContacts = localStorage.getItem("contacts");
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
    }
  }

  private saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(this.contacts));
  }

  private addContact() {
    const firstName = (
      document.getElementById("first-name") as HTMLInputElement
    ).value;
    const lastName = (document.getElementById("last-name") as HTMLInputElement)
      .value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;

    if (firstName && lastName && phone && email) {
      const newContact: Contact = {
        id: Date.now(),
        firstName,
        lastName,
        phone,
        email,
      };
      this.contacts.push(newContact);
      this.saveContacts();
      this.renderContacts();
      (document.getElementById("first-name") as HTMLInputElement).value = "";
      (document.getElementById("last-name") as HTMLInputElement).value = "";
      (document.getElementById("phone") as HTMLInputElement).value = "";
      (document.getElementById("email") as HTMLInputElement).value = "";
    }
  }

  private renderContacts() {
    const startIndex = (this.currentPage - 1) * this.perPage;
    const endIndex = startIndex + this.perPage;
    const paginatedContacts = this.contacts.slice(startIndex, endIndex);

    const contactList = document.getElementById("contact-list")!;
    contactList.innerHTML = "";

    paginatedContacts.forEach((contact) => {
      const contactItem = document.createElement("div");
      contactItem.className = "contact-item";
      contactItem.innerHTML = `
              <span>${contact.firstName} ${contact.lastName}</span>
              <span>${contact.phone}</span>
              <span>${contact.email}</span>
              <button onclick="editContact(${contact.id})">Dəyişdir</button>
              <button onclick="deleteContact(${contact.id})">Sil</button>
          `;
      contactList.appendChild(contactItem);
    });

    this.updatePaginationInfo();
  }

  private changePage(direction: number) {
    this.currentPage += direction;
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (
      this.currentPage > Math.ceil(this.contacts.length / this.perPage)
    ) {
      this.currentPage = Math.ceil(this.contacts.length / this.perPage);
    }
    this.renderContacts();
  }

  private updatePaginationInfo() {
    const pageInfo = document.getElementById("page-info")!;
    pageInfo.textContent = `${this.currentPage}/${Math.ceil(
      this.contacts.length / this.perPage
    )}`;
  }

  private deleteContact(id: number) {
    this.contacts = this.contacts.filter((contact) => contact.id !== id);
    this.saveContacts();
    this.renderContacts();
  }

  private editContact(id: number) {
    const contact = this.contacts.find((contact) => contact.id === id);
    if (contact) {
      (document.getElementById("first-name") as HTMLInputElement).value =
        contact.firstName;
      (document.getElementById("last-name") as HTMLInputElement).value =
        contact.lastName;
      (document.getElementById("phone") as HTMLInputElement).value =
        contact.phone;
      (document.getElementById("email") as HTMLInputElement).value =
        contact.email;
      this.deleteContact(id);
    }
  }

  private filterContacts() {
    const criteria = (
      document.getElementById("filter-criteria") as HTMLSelectElement
    ).value;
    const value = (
      document.getElementById("filter-value") as HTMLInputElement
    ).value.toLowerCase();

    this.contacts = this.contacts.filter((contact) => {
      const field = contact[criteria as keyof Contact];
      return typeof field === "string" && field.toLowerCase().includes(value);
    });
    this.currentPage = 1;
    this.renderContacts();
  }
}

window.onload = () => {
  (window as any).contactBook = new ContactBook();
};
