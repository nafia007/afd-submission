# Admin Dashboard Setup Guide

## Overview
The Admin Dashboard has been created and is accessible only to `nafiakocks76@gmail.com`. It provides two main features:
1. **User Management** - View all registered users
2. **AFD Submissions Review** - Review film submissions

## Current Status
✅ Admin Dashboard page created  
✅ Navigation button added (Admin)  
✅ Route configured (`/admin`)  
✅ Access restricted to `nafiakocks76@gmail.com`  
✅ User listing functionality  
✅ Submissions listing functionality  
✅ File download functionality  

## To Enable Approval/Rejection System

### 1. Database Migration Required
Run the following SQL in your Supabase database to add the status field:

```sql
-- Add status field to afd_submissions table
ALTER TABLE public.afd_submissions 
ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing submissions to have pending status
UPDATE public.afd_submissions 
SET status = 'pending' 
WHERE status IS NULL;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_afd_submissions_status ON public.afd_submissions(status);
CREATE INDEX IF NOT EXISTS idx_afd_submissions_user_id ON public.afd_submissions(user_id);

-- Add policy for admins to update submission status
CREATE POLICY "Admins can update submission status" ON public.afd_submissions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
```

### 2. Update AdminDashboard Component
Once the migration is run, you can uncomment and enable the approval/rejection functionality in `src/pages/AdminDashboard.tsx`.

## Features

### User Management Tab
- Lists all registered users
- Shows email, role, creation date, and last sign-in
- Displays user count

### Submissions Review Tab
- Lists all AFD film submissions
- Shows title, director, user email, tier, and submission date
- Allows downloading of submitted files
- **Note**: Approval/rejection buttons will appear after database migration

## Access Control
- Only `nafiakocks76@gmail.com` can access the Admin Dashboard
- Access is checked on both the frontend and backend
- Unauthorized users are redirected to the home page

## File Structure
```
src/
├── pages/
│   └── AdminDashboard.tsx    # Main admin dashboard
├── components/
│   └── Navigation.tsx        # Updated with Admin button
└── App.tsx                   # Updated with /admin route
```

## Usage
1. Login with `nafiakocks76@gmail.com`
2. Click the "Admin" button in the navigation bar
3. Use the tabs to switch between Users and Submissions
4. Download files for review
5. After migration: Approve or reject submissions as needed

## Security Notes
- Admin access is restricted by email address
- Database policies ensure only admins can update submission status
- File downloads are restricted to admin users only 

---

If you see "no data" in your Admin Dashboard, here’s a step-by-step checklist to diagnose and fix the issue:

---

## 1. **Check if There Is Data in the Database**

- **Go to your Supabase dashboard** → Table Editor.
- **Open the `user_profiles` and `afd_submissions` tables.**
- **Are there any rows?**
  - If not, you need to create users and submissions first.

---

## 2. **Check Row Level Security (RLS) Policies**

If there is data in the tables but you still see nothing in the dashboard, it’s almost always a Row Level Security (RLS) issue.

### **For `afd_submissions` Table:**
You need a policy that allows admin users to see all submissions.

**Example SQL:**
```sql
-- Allow admin to view all submissions
CREATE POLICY "Admins can view all submissions" ON afd_submissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
```

### **For `profiles` or `user_profiles` Table:**
You need a policy that allows admin users to see all users.

**Example SQL:**
```sql
-- Allow admin to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  role = 'admin' OR id = auth.uid()
);
```
Or, if you use a function:
```sql
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  get_current_user_role() = 'admin'
);
```

---

## 3. **Are You Logged In as the Admin?**

- Only `nafiakocks76@gmail.com` will see all data.
- If you are logged in as a different user, you will only see your own data (or nothing, if you have no submissions).

---

## 4. **Check for Errors in the Browser Console**

- Open DevTools (F12) → Console and Network tabs.
- Look for errors or failed requests.
- If you see a 403 or empty array, it’s an RLS or permissions issue.

---

## 5. **Test Directly in Supabase SQL Editor**

- Run:
  ```sql
  select * from afd_submissions;
  select * from user_profiles;
  ```
- Do you see data? If not, check your RLS policies.

---

## 6. **Summary Table**

| Problem                | Solution                                      |
|------------------------|-----------------------------------------------|
| No rows in table       | Add test data                                 |
| RLS blocks admin       | Add admin SELECT policy as above              |
| Not logged in as admin | Log in as `nafiakocks76@gmail.com`            |
| 403/empty array        | Fix RLS, check browser console for errors     |

---

## 7. **What to Do Next**

1. **Check your Supabase tables for data.**
2. **Add the admin SELECT policies if missing.**
3. **Log in as `nafiakocks76@gmail.com`.**
4. **Refresh the dashboard.**

---

If you want, you can paste your current RLS policies here and I’ll review them for you. Or, let me know if you want the exact SQL to copy-paste for your setup! 

## **Step 1: Add RLS Policies for Admin Access**

You need to run these SQL commands in your Supabase SQL Editor to allow admin users to see all data:

### **For `afd_submissions` table:**
```sql
-- Allow admin to view all submissions
CREATE POLICY "Admins can view all submissions" ON afd_submissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
```

### **For `profiles` or `user_profiles` table:**
```sql
-- Allow admin to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  role = 'admin' OR id = auth.uid()
);
```

## **Step 2: Check Your Current User Role**

Make sure your user (`nafiakocks76@gmail.com`) has the `admin` role in the `profiles` table:

```sql
-- Check if your user has admin role
SELECT * FROM profiles WHERE user_id = auth.uid();

-- If not, update it to admin
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = auth.uid();
```

## **Step 3: Verify Data Exists**

Check if there's actually data in your tables:

```sql
-- Check submissions
SELECT COUNT(*) FROM afd_submissions;

-- Check profiles
SELECT COUNT(*) FROM profiles;
```

## **Step 4: Test the Policies**

Test if the policies work by running:

```sql
-- This should return all submissions if you're admin
SELECT * FROM afd_submissions;

-- This should return all profiles if you're admin
SELECT * FROM profiles;
```

## **How to Run These Commands:**

1. **Go to your Supabase Dashboard**
2. **Click on "SQL Editor" in the left sidebar**
3. **Copy and paste each SQL command above**
4. **Click "Run" for each one**

## **Common Issues:**

- **No data in tables**: You need to create users and submissions first
- **RLS blocking access**: The policies above will fix this
- **User not admin**: Update your user's role to 'admin'
- **Wrong table names**: Make sure you're using the correct table names from your schema

## **Quick Test:**

After running the policies, refresh your Admin Dashboard. You should now see:
- All users in the Users tab
- All submissions in the Submissions tab

Let me know if you still see "no data" after running these SQL commands, and I can help you debug further! 