type EventCallback<T = unknown> = (payload: T) => void;

export class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  on<T>(event: string, callback: EventCallback<T>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback as EventCallback);
  }

  off(event: string, callback: EventCallback): void {
    this.listeners[event] =
      this.listeners[event]?.filter((cb) => cb !== callback) ?? [];
  }

  publish<T>(event: string, payload: T): void {
    this.listeners[event]?.forEach((cb) => {
      cb(payload);
    });
  }
}
