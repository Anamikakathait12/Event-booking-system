import mongoose from 'mongoose';
import Event from '../models/Event.js';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function invalidEventId(res) {
  return res.status(400).json({ error: 'Invalid event ID.' });
}

export async function listEvents(req, res, next) {
  try {
    const { page, limit, search, date } = req.validatedQuery;
    const filter = {};

    if (search) {
      const expression = new RegExp(escapeRegExp(search), 'i');
      filter.$or = [
        { title: expression },
        { description: expression },
        { venue: expression },
        { category: expression },
      ];
    }

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(start.valueOf() + 24 * 60 * 60 * 1000);
      filter.date = { $gte: start, $lt: end };
    }

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: 1, time: 1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Event.countDocuments(filter),
    ]);

    return res.status(200).json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEvent(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return invalidEventId(res);
  }

  try {
    const event = await Event.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return next(error);
  }
}

export async function createEvent(req, res, next) {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id,
    });

    return res.status(201).json({ event });
  } catch (error) {
    return next(error);
  }
}

export async function updateEvent(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return invalidEventId(res);
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    Object.assign(event, req.body);
    await event.save();

    return res.status(200).json({ event });
  } catch (error) {
    return next(error);
  }
}

export async function deleteEvent(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return invalidEventId(res);
  }

  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
