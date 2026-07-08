import Stripe from 'stripe';

// Client Stripe partagé. La clé secrète vient de backend/.env (STRIPE_SECRET_KEY).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
