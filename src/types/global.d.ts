export {};

declare global {
  interface Document {
    syncNow: (event: Event) => void;
    findProduct: (event: Event) => Promise<boolean>;
    addTicket: (event: Event) => void;
  }
}
