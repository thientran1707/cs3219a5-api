'use strict';

import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = Schema({
  email: { type: String, unique: true, lowercase: true },
  repos: [String],
  last_used: Date
});

export default mongoose.model('Subscription', SubscriptionSchema);
