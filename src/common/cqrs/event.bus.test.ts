import { EventBus } from "@/common/cqrs";

describe("EventBus", () => {
  it("Instantiate", () => {
    const bus = new EventBus();
    expect(bus).toBeTruthy();
  });

  describe("on()", () => {
    it("should register a listener and call it on publish", () => {
      const bus = new EventBus();
      const listener = vi.fn();

      bus.on("TestEvent", listener);

      const payload = { id: 1, name: "Test" };
      bus.publish("TestEvent", payload);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(payload);
    });

    it("should support multiple listeners for the same event", () => {
      const bus = new EventBus();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      bus.on("TestEvent", listener1);
      bus.on("TestEvent", listener2);

      const payload = { id: 123 };
      bus.publish("TestEvent", payload);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it("should not call listeners registered for other events", () => {
      const bus = new EventBus();
      const first = vi.fn();
      const second = vi.fn();

      bus.on("TestEvent", first);
      bus.on("OtherEvent", second);

      bus.publish("TestEvent", { id: 1 });

      expect(first).toHaveBeenCalledTimes(1);
      expect(second).not.toHaveBeenCalled();
    });
  });

  describe("publish()", () => {
    it("should do nothing when no listeners are registered", () => {
      const bus = new EventBus();

      expect(() =>
        bus.publish("UnknownEvent", { any: "payload" }),
      ).not.toThrow();
    });
  });

  describe("off()", () => {
    it("should remove a listener and not call it after removal", () => {
      const bus = new EventBus();
      const listener = vi.fn();

      bus.on("TestEvent", listener);
      bus.off("TestEvent", listener);

      bus.publish("TestEvent", { id: 1 });

      expect(listener).not.toHaveBeenCalled();
    });

    it("should remove only the provided callback, leaving other listeners intact", () => {
      const bus = new EventBus();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      bus.on("TestEvent", listener1);
      bus.on("TestEvent", listener2);

      bus.off("TestEvent", listener1);

      bus.publish("TestEvent", { id: 1 });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it("should not throw when removing a listener from an event with no listeners", () => {
      const bus = new EventBus();
      const listener = vi.fn();

      expect(() => bus.off("UnknownEvent", listener)).not.toThrow();
    });

    it("should be safe to remove the same listener multiple times", () => {
      const bus = new EventBus();
      const listener = vi.fn();

      bus.on("TestEvent", listener);
      bus.off("TestEvent", listener);
      bus.off("TestEvent", listener);

      bus.publish("TestEvent", { id: 1 });

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
