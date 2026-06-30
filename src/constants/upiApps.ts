export const UPI_APPS = [
  { id: 'phonepe', label: 'PhonePe', icon: 'cellphone-wireless', color: '#6739B7' },
  { id: 'gpay', label: 'GPay', icon: 'google', color: '#4285F4' },
  { id: 'paytm', label: 'Paytm', icon: 'wallet', color: '#00BAF2' },
  { id: 'cred', label: 'CRED', icon: 'credit-card', color: '#1A1A2E' },
  { id: 'bhim', label: 'BHIM', icon: 'bank', color: '#FF6B35' },
  { id: 'amazonpay', label: 'Amazon Pay', icon: 'cart', color: '#FF9900' },
  { id: 'other_upi', label: 'Other UPI', icon: 'transfer', color: '#95A5A6' },
] as const;

export type UpiAppId = typeof UPI_APPS[number]['id'];

export function getUpiAppById(id: string) {
  return UPI_APPS.find((u) => u.id === id) ?? UPI_APPS[UPI_APPS.length - 1];
}
