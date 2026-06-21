import { Html, Body, Container, Section, Text, Heading, Hr, Img, Row, Column, Link } from '@react-email/components';
import * as React from 'react';
import type { CartItem } from '@/lib/types/cart';
import type { ShippingAddress } from '@/lib/types/checkout';

interface InvoiceEmailProps {
  orderNumber: string;
  customerName: string;
  email: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingPrice: number;
  tax: number;
  total: number;
  paymentMethod: string;
  orderDate: string;
}

export function InvoiceEmail({
  orderNumber,
  customerName,
  email,
  items,
  shippingAddress,
  subtotal,
  shippingPrice,
  tax,
  total,
  paymentMethod,
  orderDate,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.title}>Order Confirmation</Heading>
            <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
          </Section>

          <Hr style={styles.divider} />

          {/* Thank you message */}
          <Section style={styles.section}>
            <Text style={styles.text}>
              Hi {customerName},
            </Text>
            <Text style={styles.text}>
              Thank you for your purchase! Your order has been confirmed and is being processed.
            </Text>
          </Section>

          <Hr style={styles.divider} />

          {/* Order details */}
          <Section style={styles.section}>
            <Heading style={styles.heading}>Order Details</Heading>
            <Text style={styles.detailText}>
              <strong>Order Date:</strong> {orderDate}
            </Text>
            <Text style={styles.detailText}>
              <strong>Payment Method:</strong> {paymentMethod}
            </Text>
            <Text style={styles.detailText}>
              <strong>Email:</strong> {email}
            </Text>
          </Section>

          <Hr style={styles.divider} />

          {/* Items */}
          <Section style={styles.section}>
            <Heading style={styles.heading}>Items</Heading>
            {items.map((item, index) => (
              <Row key={index} style={styles.itemRow}>
                <Column style={styles.itemImage}>
                  {item.image && (
                    <Img
                      src={item.image.url}
                      alt={item.image.altText || item.title}
                      width={60}
                      height={60}
                      style={styles.image}
                    />
                  )}
                </Column>
                <Column style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.variantTitle && item.variantTitle !== 'Default Title' && (
                    <Text style={styles.itemVariant}>{item.variantTitle}</Text>
                  )}
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={styles.itemPrice}>
                  <Text style={styles.priceText}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={styles.divider} />

          {/* Totals */}
          <Section style={styles.section}>
            <Row style={styles.totalRow}>
              <Column><Text style={styles.totalLabel}>Subtotal</Text></Column>
              <Column><Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text></Column>
            </Row>
            <Row style={styles.totalRow}>
              <Column><Text style={styles.totalLabel}>Shipping</Text></Column>
              <Column><Text style={styles.totalValue}>
                {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
              </Text></Column>
            </Row>
            <Row style={styles.totalRow}>
              <Column><Text style={styles.totalLabel}>Tax</Text></Column>
              <Column><Text style={styles.totalValue}>${tax.toFixed(2)}</Text></Column>
            </Row>
            <Hr style={styles.miniDivider} />
            <Row style={styles.totalRow}>
              <Column><Text style={styles.grandTotalLabel}>Total</Text></Column>
              <Column><Text style={styles.grandTotalValue}>${total.toFixed(2)}</Text></Column>
            </Row>
          </Section>

          <Hr style={styles.divider} />

          {/* Shipping address */}
          <Section style={styles.section}>
            <Heading style={styles.heading}>Shipping Address</Heading>
            <Text style={styles.addressText}>
              {shippingAddress.firstName} {shippingAddress.lastName}
            </Text>
            <Text style={styles.addressText}>{shippingAddress.address1}</Text>
            {shippingAddress.address2 && (
              <Text style={styles.addressText}>{shippingAddress.address2}</Text>
            )}
            <Text style={styles.addressText}>
              {shippingAddress.city}, {shippingAddress.province} {shippingAddress.zip}
            </Text>
            <Text style={styles.addressText}>{shippingAddress.country}</Text>
            {shippingAddress.phone && (
              <Text style={styles.addressText}>Phone: {shippingAddress.phone}</Text>
            )}
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              If you have any questions, reply to this email.
            </Text>
            <Text style={styles.footerText}>
              Thank you for shopping with us!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f6f6f6',
    margin: 0,
    padding: 0,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#171717',
    padding: '24px 32px',
    textAlign: 'center' as const,
  },
  title: {
    color: '#ffffff',
    fontSize: '24px',
    margin: '0 0 8px 0',
  },
  orderNumber: {
    color: '#a3a3a3',
    fontSize: '14px',
    margin: 0,
  },
  section: {
    padding: '20px 32px',
  },
  heading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#171717',
    margin: '0 0 12px 0',
  },
  text: {
    fontSize: '14px',
    color: '#404040',
    lineHeight: '20px',
    margin: '0 0 8px 0',
  },
  detailText: {
    fontSize: '14px',
    color: '#404040',
    margin: '0 0 4px 0',
  },
  itemRow: {
    padding: '12px 0',
    borderBottom: '1px solid #e5e5e5',
  },
  itemImage: {
    width: '60px',
    verticalAlign: 'top' as const,
  },
  image: {
    borderRadius: '4px',
  },
  itemInfo: {
    paddingLeft: '12px',
    verticalAlign: 'top' as const,
  },
  itemTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#171717',
    margin: '0 0 2px 0',
  },
  itemVariant: {
    fontSize: '12px',
    color: '#737373',
    margin: '0 0 2px 0',
  },
  itemQuantity: {
    fontSize: '12px',
    color: '#737373',
    margin: 0,
  },
  itemPrice: {
    textAlign: 'right' as const,
    verticalAlign: 'top' as const,
  },
  priceText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#171717',
    margin: 0,
  },
  totalRow: {
    padding: '6px 0',
  },
  totalLabel: {
    fontSize: '14px',
    color: '#737373',
    margin: 0,
  },
  totalValue: {
    fontSize: '14px',
    color: '#171717',
    textAlign: 'right' as const,
    margin: 0,
  },
  grandTotalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#171717',
    margin: 0,
  },
  grandTotalValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#171717',
    textAlign: 'right' as const,
    margin: 0,
  },
  addressText: {
    fontSize: '14px',
    color: '#404040',
    margin: '0 0 2px 0',
  },
  footer: {
    padding: '20px 32px',
    backgroundColor: '#fafafa',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '12px',
    color: '#737373',
    margin: '0 0 4px 0',
  },
  divider: {
    margin: 0,
    borderColor: '#e5e5e5',
  },
  miniDivider: {
    margin: '8px 0',
    borderColor: '#e5e5e5',
  },
};