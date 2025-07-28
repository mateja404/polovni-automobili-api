import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdDocument = Ad & Document;

@Schema()
export class Ad {

  @Prop({ required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  opis: string;

  @Prop({ required: true })
  premium: boolean;

  @Prop({ required: true })
  stanje: string;

  @Prop({ required: true })
  marka: string

  ;@Prop({ required: true })
  model: string;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true })
  kilometraza: string;

  @Prop({ required: true })
  karoserija: string;

  @Prop({ required: true })
  gorivo: string;

  @Prop({ required: true })
  kubikaza: string;

  @Prop({ required: true })
  snaga: string;

  @Prop({ required: true })
  fixna: string;

  @Prop({ required: true })
  zamena: string;

  @Prop({ required: true })
  oprema: [string];

  @Prop({ required: true })
  sigurnost: [string];

  @Prop({ required: true })
  images: [string]
}

export const UserSchema = SchemaFactory.createForClass(Ad);