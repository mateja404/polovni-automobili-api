import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResetlinkDocument = Resetlink & Document;

@Schema()
export class Resetlink {

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  resetLink: string;

  @Prop({ required: true, default: false })
  isActivated: boolean;
}

export const ResetlinkSchema = SchemaFactory.createForClass(Resetlink);