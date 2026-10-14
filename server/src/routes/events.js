import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent,
} from '../controllers/event-controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, validateQuery } from '../middleware/validate.js';
import {
  createEventSchema,
  listEventsQuerySchema,
  updateEventSchema,
} from '../validators/events.js';

const router = Router();

router.get('/', validateQuery(listEventsQuerySchema), listEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, requireAdmin, validate(createEventSchema), createEvent);
router.put('/:id', authenticate, requireAdmin, validate(updateEventSchema), updateEvent);
router.delete('/:id', authenticate, requireAdmin, deleteEvent);

export default router;
