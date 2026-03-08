import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for the Booking document
export interface IBooking extends Document {
  _id: string;
  eventId: Schema.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for the Booking model
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // RFC 5322 compliant email regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Verify that referenced eventId exists in the Event collection
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isNew || this.isModified('eventId')) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = models.Event || (await import('./event.model')).default;
      
      // Check if the event exists
      const eventExists = await Event.exists({ _id: this.eventId });
      
      if (!eventExists) {
        throw new Error(`Event with ID ${this.eventId} does not exist`);
      }
    } catch (error) {
      return next(error as Error);
    }
  }
  
  next();
});

// Index on eventId for efficient queries when fetching bookings for a specific event
BookingSchema.index({ eventId: 1 });

// Prevent model recompilation in development (Next.js hot reload)
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
