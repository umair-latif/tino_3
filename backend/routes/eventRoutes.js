import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { models } from '../models/index.js';

const router = express.Router();

// Create an event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, start, end, allDay } = req.body;
    console.log(req.user);
    
    const event = await models.Event.create({
      title,
      description,
      start,
      end,
      allDay,
      createdBy: req.user.userId, // Associate the event with the logged-in user
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: `[Create an event] ${error.message}`});
  }
});

// Get all events
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await models.Event.findAll({
      where: { createdBy: String(req.user.userId) }, // Only fetch events created by the logged-in user
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    console.log("Updating event with data:", req.body);
    const { title, description, start, end, allDay } = req.body;

    // Check if dates are valid
    if (!start || !end || isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
        return res.status(400).json({ error: `Invalid date format. Start: ${Date.parse(start)} End: ${Date.parse(end)}` });
    }

    const { id } = req.params;
    const event = await models.Event.findOne({
      where: { id, createdBy: req.user.userId }, // Ensure the event belongs to the logged-in user
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await models.Event.findOne({
      where: { id, createdBy: req.user.userId }, // Ensure the event belongs to the logged-in user
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;