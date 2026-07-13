export interface IMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  createdAt: string;
}

export interface IMessageCreateInput {
  name: string;
  email: string;
  subject: string;
  body: string;
}
