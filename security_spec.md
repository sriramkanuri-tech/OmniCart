# Security Specification - OmniCart

## 1. Data Invariants
1. A user can only read and write their own profile document (`/users/{userId}`).
2. A user can only read, create, update, and delete subcollections representing their own transactions, orders, and rewards (`/users/{userId}/transactions/*, /users/{userId}/orders/*, /users/{userId}/rewards/*`).
3. Only the authenticated owner of the parent profile `userId` matches `request.auth.uid`. No cross-user pollution or access is permitted.
4. Validation rule: Fields like profile balances or points must be numbers, and name, email, phone must be valid string structures with appropriate sizes.

## 2. The "Dirty Dozen" Payloads
These payloads attempt to breach security boundaries and must return `PERMISSION_DENIED`.

1. **Identity Spoofing - Profile hijacking**: Attempting to write a profile document at `/users/malicious_user` with a victim's `uid` but setting fields representing malicious information. (Rejected because auth.uid != document path matching uid)
2. **Identity Spoofing - Balance manipulation on someone else**: Attempting to modify `/users/victim_user` by setting positive balances. (Rejected because user is not victim_user)
3. **Privilege Escalation - Modifying restricted fields**: Attempting to set an unrequested mock administrator field or system status inside user profile. (Rejected by strict schema validation)
4. **Denial of Wallet - Long string ID injector**: Document creation on transactions with a 2MB long malicious string name or system characters. (Rejected by `isValidId`)
5. **Denial of Wallet - Extreme string field payload**: Injecting a 50KB long string in profile's `name` property. (Rejected by strict size-checking in schema validation)
6. **Cross-user Reading - Unauthorized list queries**: Attempting to query `/users/victim_user/transactions` without being authenticated as victim_user. (Rejected by query enforcer validating path owner match)
7. **Cross-user Writing - Transaction injection**: Writing a malicious charges transaction under a different user's subcollection `/users/victim_user/transactions/tax-fraud`. (Rejected by child owner verification and path validation)
8. **Orphaned Write - Sibling state hijacking**: Creating a transaction under someone else's space without matching validation credentials. (Rejected by ownership gates)
9. **Update-Gap - Status bypass on Rewards**: Bypassing standard Claimed status gating of rewards via direct API call. (Rejected by state-action verification and affectedKeys)
10. **Value Poisoning - Boolean injection list**: Writing a non-string value for transaction type or title. (Rejected by type validation)
11. **Immutability Breach - Modify createdAt**: Updating `createdAt` or `userId` in a transaction after its creation. (Rejected by immutability constraints)
12. **Unverified Auth Bypass**: Reading PII data or making writes when `request.auth.token.email_verified` is not true (if required).

## 3. Test Cases (firestore.rules)
All cases must be validated to strictly throw `PERMISSION_DENIED` upon security violation.

---
