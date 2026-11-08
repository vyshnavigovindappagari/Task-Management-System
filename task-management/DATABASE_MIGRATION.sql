-- Run this after starting the updated backend once (Hibernate adds owner_id).
-- Replace YOUR_USERNAME with the username that owns the existing tasks.
-- If the tasks table is empty, no migration is needed.
UPDATE tasks
SET owner_id = (SELECT id FROM app_users WHERE username = 'YOUR_USERNAME' LIMIT 1)
WHERE owner_id IS NULL;
