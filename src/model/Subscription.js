'use strict';

import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = Schema({
  email: String,
  repos: [String],
  last_used: Date
});

export default mongoose.model('Subscription', SubscriptionSchema);
