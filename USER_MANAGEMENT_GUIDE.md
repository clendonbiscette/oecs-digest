# User Management Guide
## OECS Education Statistical Digest - Multi-User System

### Overview
The system supports multiple users across all 9 OECS Member States with role-based access control to ensure data security and integrity.

---

## User Roles

### 1. **Admin** (EDMU Staff)
- **Access**: Full system access across all Member States
- **Permissions**:
  - Create and manage user accounts
  - View data from all countries (read-only)
  - Manage system settings
  - Generate reports and analytics
- **Use Case**: Education Development Management Unit (EDMU) staff

### 2. **Statistician** (Country Data Experts)
- **Access**: Limited to their assigned Member State only
- **Permissions**:
  - Full read/write access to their country's data
  - Cannot view other countries' data
  - Cannot manage users
  - Submit data for their country
- **Use Case**: National statisticians and data experts from each Member State

### 3. **Viewer** (Stakeholders/Partners)
- **Access**: Read-only access to reports and dashboards
- **Permissions**:
  - View published reports
  - Access dashboards and analytics
  - Cannot edit or enter data
- **Use Case**: Development partners, Commission stakeholders, researchers

---

## For EDMU Administrators

### Accessing the Admin Dashboard

1. Log in with your admin account
2. Navigate to `/admin` or click "Admin Dashboard" from the menu
3. You'll see system statistics and management options

### Creating User Accounts for Statisticians

**Step 1: Access User Management**
- From the Admin Dashboard, click "User Management"
- Or navigate directly to `/admin/users`

**Step 2: Invite New User**
1. Click the "Invite User" button
2. Fill in required information:
   - **Email**: User's work email address
   - **Full Name**: User's complete name
   - **Temporary Password**: At least 6 characters (user should change on first login)
   - **Member State**: Select the country this statistician represents
   - **Role**: Typically "Statistician" for data entry users

**Step 3: Send Invitation**
- Click "Send Invitation"
- The user will receive account credentials
- They can log in immediately with the temporary password

### Managing Existing Users

**View All Users**
- The User Management page shows all registered users
- Information displayed:
  - Name and email
  - Assigned Member State
  - Role and status
  - Last login date

**Edit User**
1. Click the edit icon (pencil) next to any user
2. Update:
   - Full name
   - Assigned Member State
   - Role
3. Click "Save Changes"

**Activate/Deactivate Users**
- Click the checkmark/X button to toggle user status
- Deactivated users cannot log in
- Use this instead of deleting accounts to maintain audit trails

---

## Member State Assignments

Each of the 9 OECS Member States can have multiple statisticians:

1. **Anguilla** (ANG)
2. **Antigua & Barbuda** (A&B)
3. **Dominica** (DOM)
4. **Grenada** (GRD)
5. **Montserrat** (MON)
6. **St. Kitts & Nevis** (SKN)
7. **St. Lucia** (SLU)
8. **St. Vincent & the Grenadines** (SVG)
9. **British Virgin Islands** (VI)

### Best Practices

**Primary Statistician**
- Assign one primary statistician per country
- This person is responsible for coordinating data entry

**Backup Users**
- Create backup accounts for continuity
- Ensure credentials are securely shared within the country team

**Admin Accounts**
- Limit admin accounts to EDMU staff only
- Admins should not routinely enter data

---

## Data Security & Access Control

### Row Level Security (RLS)
The system uses PostgreSQL Row Level Security to ensure:
- Statisticians can only access their country's data
- Data from other countries is completely hidden
- Admins can view all data for oversight (read-only)

### Data Isolation
- Each country's data is isolated at the database level
- Even if a user tries to access another country's URL, they'll be blocked
- All queries automatically filter by country_id

### Audit Trail
- All user actions are logged with timestamps
- Admins can see who last modified data
- Submission history is tracked per country

---

## Common Scenarios

### Scenario 1: New Statistician Joining
**Problem**: St. Lucia hired a new statistician
**Solution**:
1. Admin logs into `/admin/users`
2. Click "Invite User"
3. Enter email, name, select "St. Lucia"
4. Set role as "Statistician"
5. New user can immediately start entering data for St. Lucia only

### Scenario 2: Statistician Leaving
**Problem**: Grenada's statistician is retiring
**Solution**:
1. Admin deactivates the outgoing user's account
2. Create new account for replacement
3. Old data remains intact and attributed to original user
4. New user can continue from where predecessor left off

### Scenario 3: Multiple Users Per Country
**Problem**: Dominica wants two people entering data
**Solution**:
1. Create two separate accounts, both assigned to Dominica
2. Both users can log in and edit Dominica's data
3. System tracks who made each change
4. Users should coordinate to avoid conflicts

### Scenario 4: Development Partner Access
**Problem**: World Bank wants to view latest data
**Solution**:
1. Create viewer account (no country assignment needed)
2. Grant access to reports dashboard only
3. Cannot edit or view raw data entry forms

---

## For Country Statisticians

### First Login
1. Use the email and temporary password provided by EDMU
2. You'll be prompted to change your password
3. You'll land on the Data Entry dashboard

### Data Entry Access
You can only access data for your assigned Member State:
- All 8 data entry forms are available
- Data is automatically tagged with your country
- Previous entries for your country are visible
- You cannot see other countries' data

### Submitting Data
1. Complete all required forms
2. Use the "Save" button frequently
3. Data is auto-saved to prevent loss
4. When complete, mark submission as final (coming soon)

---

## Technical Notes

### Database Tables
- `user_profiles`: Stores user information and country assignments
- `countries`: 9 OECS Member States
- `academic_years`: Academic year tracking
- All data tables have `country_id` foreign key

### Authentication
- Powered by Supabase Auth
- Secure password hashing
- Session management
- Email verification optional

### Permissions Matrix

| Action | Admin | Statistician | Viewer |
|--------|-------|--------------|--------|
| View own country data | ✓ | ✓ | ✗ |
| Edit own country data | ✗ | ✓ | ✗ |
| View all countries | ✓ | ✗ | ✗ |
| Edit all countries | ✗ | ✗ | ✗ |
| Manage users | ✓ | ✗ | ✗ |
| View reports | ✓ | ✓ | ✓ |
| Generate chapters | ✓ | ✗ | ✗ |

---

## Support & Troubleshooting

### User Cannot Log In
1. Check if account is active (admin checks status)
2. Verify correct email address
3. Reset password if needed

### User Sees Wrong Country Data
1. Admin verifies correct country assignment
2. Update user's country_id if incorrect
3. User should log out and back in

### Multiple Users Editing Same Data
- Last save wins
- Users should coordinate data entry schedules
- Future: Add locking mechanism to prevent conflicts

---

## Database Migration

Before using the user management system, run:

```sql
-- In Supabase SQL Editor
-- Execute: database_updates_admin_user_management.sql
```

This sets up:
- Admin permissions to view all user profiles
- Admin read-only access to all country data
- Proper Row Level Security policies
- Helper functions for role checking

---

## Future Enhancements

- [ ] Email invitations with magic links
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] User activity logs
- [ ] Data submission workflow (draft → submit → approve)
- [ ] Conflict detection for simultaneous edits
- [ ] Bulk user import/export
- [ ] Permission presets by role

---

**For questions or support:**
Contact EDMU Technical Team
