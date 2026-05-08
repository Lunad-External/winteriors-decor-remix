import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Winteriors Decor LLC'

interface EnquiryNotificationProps {
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  submittedAt?: string
}

const EnquiryNotificationEmail = ({
  name = 'Anonymous',
  email = '',
  phone = '',
  company,
  message = '',
  submittedAt,
}: EnquiryNotificationProps) => {
  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleString('en-AE', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Dubai',
      })
    : new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New enquiry from {name} — {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>New Enquiry Received</Heading>
            <Text style={subtitle}>{SITE_NAME}</Text>
          </Section>

          <Section style={card}>
            <Text style={greeting}>
              You've received a new enquiry through the website.
            </Text>

            <Hr style={hr} />

            <Row label="Name" value={name} />
            <Row
              label="Email"
              value={
                email ? (
                  <Link href={`mailto:${email}`} style={link}>
                    {email}
                  </Link>
                ) : (
                  '—'
                )
              }
            />
            <Row
              label="Phone"
              value={
                phone ? (
                  <Link href={`tel:${phone.replace(/\s+/g, '')}`} style={link}>
                    {phone}
                  </Link>
                ) : (
                  '—'
                )
              }
            />
            {company && <Row label="Company" value={company} />}

            <Hr style={hr} />

            <Text style={messageLabel}>Message</Text>
            <Text style={messageText}>{message}</Text>

            <Hr style={hr} />

            <Text style={timestamp}>Submitted: {formattedDate} (Dubai time)</Text>
          </Section>

          <Text style={footer}>
            This is an automated notification from your {SITE_NAME} website.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const Row = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <Section style={rowSection}>
    <Text style={rowLabel}>{label}</Text>
    <Text style={rowValue}>{value}</Text>
  </Section>
)

export const template = {
  component: EnquiryNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New enquiry from ${data?.name || 'website visitor'}`,
  displayName: 'Enquiry notification',
  to: 'info@winteriorsdecor.com',
  previewData: {
    name: 'Sarah Ahmed',
    email: 'sarah@example.com',
    phone: '+971 50 123 4567',
    company: 'Acme Interiors',
    message:
      'Hi, I would like to discuss a fit-out project for our new office in Dubai Marina. Approximately 3,000 sq ft. Looking for a turnkey solution.',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

// Styles
const purple = '#9C27B0'
const purpleDark = '#4A1E5A'
const textColor = '#333333'
const mutedColor = '#666666'

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '32px 20px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  padding: '24px 0 32px',
}

const h1 = {
  fontSize: '26px',
  fontWeight: '700',
  color: purpleDark,
  margin: '0 0 8px',
  letterSpacing: '-0.3px',
}

const subtitle = {
  fontSize: '14px',
  color: purple,
  fontWeight: '600',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}

const card = {
  backgroundColor: '#fafafa',
  borderRadius: '12px',
  padding: '28px',
  border: `1px solid #ececec`,
  borderLeft: `4px solid ${purple}`,
}

const greeting = {
  fontSize: '15px',
  color: textColor,
  margin: '0 0 8px',
  lineHeight: '1.5',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
}

const rowSection = {
  margin: '12px 0',
}

const rowLabel = {
  fontSize: '12px',
  color: mutedColor,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const rowValue = {
  fontSize: '15px',
  color: textColor,
  margin: '0',
  fontWeight: '500',
}

const link = {
  color: purple,
  textDecoration: 'none',
  fontWeight: '500',
}

const messageLabel = {
  fontSize: '12px',
  color: mutedColor,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  fontWeight: '600',
  margin: '0 0 8px',
}

const messageText = {
  fontSize: '15px',
  color: textColor,
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#ffffff',
  padding: '14px 16px',
  borderRadius: '8px',
  border: '1px solid #ececec',
}

const timestamp = {
  fontSize: '12px',
  color: mutedColor,
  margin: '0',
  fontStyle: 'italic' as const,
}

const footer = {
  fontSize: '12px',
  color: mutedColor,
  textAlign: 'center' as const,
  margin: '24px 0 0',
}
