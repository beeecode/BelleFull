import avatarGreen from '../assets/figma-inspiration/3e9121c1b0b25b864dd07e14da68efabdb31aee0.png';
import avatarOrange from '../assets/figma-inspiration/99a937f39b28fa0e7891b358a1ae20eb2efee5a8.png';
import avatarPurple from '../assets/figma-inspiration/4e7b0eb89827248ae994e0c3e4fb39c0b8486ee6.png';
import { foodMenuItems } from './foodMenuItems';

const menuById = Object.fromEntries(foodMenuItems.map((item) => [item.id, item]));

const orderItem = (id, quantity = 1) => ({
  ...menuById[id],
  quantity,
});

export const orderFilters = [
  { id: '#345', state: 'completed' },
  { id: '#346', state: 'cancelled' },
  { id: '#347', state: 'completed' },
  { id: '#348', state: 'completed' },
  { id: '#349', state: 'completed' },
  { id: '#350', state: 'cancelled' },
  { id: '#351', state: 'cancelled' },
  { id: '#352', state: 'cancelled' },
  { id: '#353', state: 'cancelled' },
  { id: '#354', state: 'cancelled' },
];

export const adminOrders = [
  {
    id: '#351',
    date: '24 May 2026, 08:28 PM',
    avatar: avatarGreen,
    status: 'pending_payment',
    items: [orderItem('cheesy-pizza'), orderItem('jollof-rice')],
  },
  {
    id: '#350',
    date: '24 May 2026, 07:42 PM',
    avatar: avatarOrange,
    status: 'cancelled',
    items: [orderItem('pasta'), orderItem('shawarma')],
  },
  {
    id: '#349',
    date: '24 May 2026, 06:15 PM',
    avatar: avatarPurple,
    status: 'completed',
    items: [orderItem('fried-rice'), orderItem('chicken-and-chips')],
  },
  {
    id: '#348',
    date: '24 May 2026, 05:36 PM',
    avatar: avatarGreen,
    status: 'pending_payment',
    items: [orderItem('barbecue'), orderItem('small-chops')],
  },
  {
    id: '#347',
    date: '24 May 2026, 04:50 PM',
    avatar: avatarOrange,
    status: 'pending_payment',
    items: [orderItem('pepper-soup'), orderItem('fish-pepper-soup')],
  },
  {
    id: '#346',
    date: '24 May 2026, 03:21 PM',
    avatar: avatarPurple,
    status: 'pending_payment',
    items: [orderItem('burger'), orderItem('parfait')],
  },
];
