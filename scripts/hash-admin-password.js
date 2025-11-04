#!/usr/bin/env node

import crypto from 'node:crypto'

const SCRYPT_PARAMS = { N: 2 ** 15, r: 8, p: 1 }
const KEY_LENGTH = 64

async function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const derived = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, SCRYPT_PARAMS, (error, result) => {
      if (error) {
        reject(error)
        return
      }
      resolve(result)
    })
  })

  return `scrypt$${SCRYPT_PARAMS.N}$${SCRYPT_PARAMS.r}$${SCRYPT_PARAMS.p}$${salt.toString('base64')}$${Buffer.from(derived).toString('base64')}`
}

async function main() {
  const password = process.argv[2]
  if (!password) {
    console.error('Usage: node scripts/hash-admin-password.js <password>')
    process.exit(1)
  }

  try {
    const hash = await hashPassword(password)
    console.log(hash)
  } catch (error) {
    console.error('Failed to derive password hash:', error)
    process.exit(1)
  }
}

main()

