import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for the Event document
export interface IEvent extends Document {
  _id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generates a URL-friendly slug from a title string
 * Converts to lowercase, removes special characters, and replaces spaces with hyphens
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Normalizes a date string to ISO 8601 format (YYYY-MM-DD)
 */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString().split('T')[0];
}

/**
 * Normalizes time to 24-hour format (HH:MM)
 */
function normalizeTime(timeStr: string): string {
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  const trimmed = timeStr.trim();
  
  if (!timeRegex.test(trimmed)) {
    throw new Error('Invalid time format. Use HH:MM (24-hour format)');
  }
  
  // Ensure two-digit format
  const [hours, minutes] = trimmed.split(':');
  return `${hours.padStart(2, '0')}:${minutes}`;
}

// Mongoose schema for the Event model
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      validate: {
        validator: (v: string) => v.length > 0,
        message: 'Title cannot be empty',
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      validate: {
        validator: (v: string) => v.length > 0,
        message: 'Description cannot be empty',
      },
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
      validate: {
        validator: (v: string) => v.length > 0,
        message: 'Overview cannot be empty',
      },
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
      validate: {
        validator: (v: string) => v.length > 0,
        message: 'Venue cannot be empty',
      },
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      validate: {
        validator: (v: string) => v.length > 0,
        message: 'Location cannot be empty',
      },
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: '{VALUE} is not a valid mode. Use online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Event audience is required'],
      trim: true,
      validate: {
        validator: (v: string) => v.length > 0,
        message: 'Audience cannot be empty',
      },
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
      validate: {
        validator: (v: string) => v.length > 0,
        message: 'Organizer cannot be empty',
      },
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Generate slug, normalize date and time
EventSchema.pre('save', function (next) {
  // Generate slug only if title is new or modified
  if (this.isNew || this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format if modified
  if (this.isNew || this.isModified('date')) {
    try {
      this.date = normalizeDate(this.date);
    } catch (error) {
      return next(error as Error);
    }
  }

  // Normalize time to consistent format if modified
  if (this.isNew || this.isModified('time')) {
    try {
      this.time = normalizeTime(this.time);
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

// Unique index on slug for efficient lookups and uniqueness enforcement
EventSchema.index({ slug: 1 }, { unique: true });

// Prevent model recompilation in development (Next.js hot reload)
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
