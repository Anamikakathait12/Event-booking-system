import { z } from 'zod';

const calendarDateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format.')
  .refine((date) => {
    const parsed = new Date(`${date}T00:00:00.000Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date;
  }, 'Date must be a valid calendar date.');
const dateSchema = calendarDateSchema.transform((date) => new Date(`${date}T00:00:00.000Z`));

const positiveInteger = z.number().int().positive();
const eventFields = {
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(5000),
  date: dateSchema,
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use 24-hour HH:mm format.'),
  venue: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(80),
  imageUrl: z.string().url().refine(
    (url) => /^https?:\/\//i.test(url),
    'Image URL must use HTTP or HTTPS.',
  ),
  price: z.number().finite().min(0),
  totalSeats: positiveInteger,
  seatLayout: z.object({
    rows: positiveInteger,
    columns: positiveInteger,
  }).strict(),
};

export const createEventSchema = z.object(eventFields).strict().refine(
  (event) => event.totalSeats <= event.seatLayout.rows * event.seatLayout.columns,
  {
    path: ['totalSeats'],
    message: 'Total seats cannot exceed the seat layout capacity.',
  },
);

export const updateEventSchema = z.object(eventFields).partial().strict().refine(
  (event) => Object.keys(event).length > 0,
  { message: 'At least one event field must be provided.' },
);

export const listEventsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive().safe())
    .default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().max(100)).default('20'),
  search: z.string().trim().max(100).optional(),
  date: calendarDateSchema.optional(),
}).strict();
