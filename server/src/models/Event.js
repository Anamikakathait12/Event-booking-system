import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
    validate: Number.isInteger,
  },
  seatLayout: {
    rows: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    columns: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  },
}, {
  timestamps: true,
});

eventSchema.pre('validate', function validateSeatCapacity() {
  const capacity = this.seatLayout?.rows * this.seatLayout?.columns;

  if (Number.isFinite(capacity) && this.totalSeats > capacity) {
    this.invalidate('totalSeats', 'Total seats cannot exceed the seat layout capacity.');
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
