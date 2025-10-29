import pool from './db'

let ensureUserInformationTablePromise: Promise<void> | null = null

const createUserInformationTable = async () => {
  const createTableStatement = `
    CREATE TABLE IF NOT EXISTS user_information (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255) NULL,
      role VARCHAR(255) NULL,
      location VARCHAR(255) NULL,
      project_context TEXT NULL,
      goals TEXT NULL,
      timeline VARCHAR(255) NULL,
      budget VARCHAR(255) NULL,
      message TEXT NULL,
      linkedin_url VARCHAR(512) NULL,
      github_url VARCHAR(512) NULL,
      website_url VARCHAR(512) NULL,
      referral_source VARCHAR(255) NULL,
      availability VARCHAR(255) NULL,
      collaboration_ideas TEXT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_information_email (email),
      INDEX idx_user_information_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `

  await pool.query(createTableStatement)
}

export const ensureUserInformationTable = () => {
  if (!ensureUserInformationTablePromise) {
    ensureUserInformationTablePromise = createUserInformationTable().catch((error) => {
      ensureUserInformationTablePromise = null
      throw error
    })
  }

  return ensureUserInformationTablePromise
}

void ensureUserInformationTable().catch((error) => {
  console.error('Failed to ensure user_information table exists', error)
})
