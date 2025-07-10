export const EMAIL_CONFIG = {
  MAX_ACTIVE_EMAILS: 30, // Maximum number of active emails
  POLL_INTERVAL: 10_000, // Polling interval in milliseconds
  DEFAULT_DAILY_SEND_LIMITS: {
    emperor: 0,   // Emperor: no limit (unrestricted
    duke: 5,      // Duke: 5 emails per day
    knight: 2,    // Knight: 2 emails per day
    civilian: -1, // Civilian: sending disabled
  },
} as const

export type EmailConfig = typeof EMAIL_CONFIG 