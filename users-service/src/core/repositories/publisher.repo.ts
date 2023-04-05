export interface IPublisherRepository {
  publish(eventName: string, payload: string): Promise<number>;
}
