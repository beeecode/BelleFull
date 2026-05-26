export const siteConfig = {
  projectName: 'AmazingTasteDelicacies',
  brandName: 'Amazing Taste',
  restaurantName: 'Amazing Taste Delicacies',
  pageTitle: 'Amazing Taste Delicacies | The Pasta Haven',
  description:
    'Amazing Taste Delicacies, also known as The Pasta Haven, serves satisfying pasta dishes, local fast-food favorites, and quick-service meals in Osogbo.',
  navigation: [
    { label: 'Menu', href: '/menu' },
    { label: 'Kitchen', href: '/#chef' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Contact', href: '/#contact' },
  ],
  contact: {
    email: null,
    phoneNumbers: [],
    whatsAppNumbers: ['0802 303 7230'],
    address: 'QGCR+373, Osogbo, Osun State, Nigeria',
    branches: [
      {
        name: 'Osogbo',
        address: 'QGCR+373, Osogbo, Osun State, Nigeria',
      },
    ],
    socialLinks: [
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/amazing_taste_delicacies/',
        status: 'provided',
      },
    ],
  },
  openingHours: [
    { days: 'Orders', hours: 'Contact on Instagram' },
    { days: 'Delivery', hours: 'Available in Osogbo' },
    { days: 'Partnerships', hours: 'Open to collaborations' },
  ],
};
